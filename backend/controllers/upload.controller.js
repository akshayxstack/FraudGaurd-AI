/**
 * controllers/upload.controller.js
 *
 * Handles POST /api/upload — the full CSV-to-prediction pipeline:
 *   1. Parse uploaded CSV (streaming)
 *   2. Validate schema and data types
 *   3. Map rows → FastAPI format (with Amount/Time scaling)
 *   4. Send to FastAPI for prediction
 *   5. Merge predictions with row data
 *   6. Compute summary statistics
 *   7. Clean up the temporary uploaded file
 *   8. Return JSON response
 */

import fs from "fs";
import { formatFileSize }           from "../utils/file.utils.js";
import { parseCSVFile }             from "../services/csvParser.service.js";
import { validateCSV } from "../services/csvValidation.service.js";
import { mapRowsToTransactions }    from "../services/featureMapper.service.js";
import { predictTransactions }      from "../services/fastapi.service.js";
import { createCase }               from "../services/database/case.service.js";
import { createTransactions }       from "../services/database/transaction.service.js";
import Case                         from "../models/Case.js";

// ── File cleanup helper ───────────────────────────────────────────────────────
/**
 * Silently deletes the temporary upload file.
 * Failures are logged but never propagated — cleanup must not shadow the
 * real response.
 */
function cleanupFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) console.warn(`[UploadController] Cleanup warning — could not delete "${filePath}": ${err.message}`);
    else     console.log(`[UploadController] Cleanup complete — deleted "${filePath}".`);
  });
}

// ── Controller ────────────────────────────────────────────────────────────────

export async function uploadCsv(req, res) {
  const { originalname, size, path: filePath } = req.file;
  const startTime = Date.now();

  console.log(`[UploadController] Upload started: "${originalname}" (${formatFileSize(size)})`);

  // ── 1. Parse ────────────────────────────────────────────────────────────────
  let headers, rows;
  try {
    ({ headers, rows } = await parseCSVFile(filePath));
  } catch (parseErr) {
    console.error(`[UploadController] Parse error: ${parseErr.message}`);
    cleanupFile(filePath);
    return res.status(400).json({
      success: false,
      error:   "Invalid CSV",
      message: `Could not read the CSV file: ${parseErr.message}`,
    });
  }

  console.log(`[UploadController] Parsing complete — ${rows.length} row(s) found.`);

  // ── 2. Validate ─────────────────────────────────────────────────────────────
  let { valid, errors, rows: validatedRows } = validateCSV(headers, rows);

  // Clear references to raw rows/headers to allow garbage collection
  rows = null;
  headers = null;

  if (!valid) {
    console.warn(`[UploadController] Validation failed — ${errors.length} error(s).`);
    cleanupFile(filePath);
    return res.status(422).json({
      success: false,
      error:   "Validation Failed",
      message: "The uploaded CSV did not pass validation. See errors for details.",
      errors,
    });
  }

  console.log(`[UploadController] Validation complete — ${validatedRows.length} valid row(s).`);

  // ── 3. Map → FastAPI format ─────────────────────────────────────────────────
  let transactions;
  try {
    transactions = mapRowsToTransactions(validatedRows);
  } catch (mapErr) {
    console.error(`[UploadController] Feature mapping error: ${mapErr.message}`);
    cleanupFile(filePath);
    return res.status(500).json({
      success: false,
      error:   "Mapping Error",
      message: "Failed to prepare transaction data for prediction.",
    });
  }

  // ── 4. Predict ──────────────────────────────────────────────────────────────
  console.log(`[UploadController] Prediction started — ${transactions.length} transaction(s).`);
  const predictionStart = Date.now();

  let mlResult;
  try {
    mlResult = await predictTransactions(transactions);
  } catch (mlErr) {
    const elapsed = Date.now() - startTime;
    cleanupFile(filePath);

    // FastAPI returned a 4xx/5xx response (Axios wraps it in error.response)
    if (mlErr.response) {
      const status  = mlErr.response.status;
      const detail  = mlErr.response.data?.detail || "The ML service returned an error.";
      console.error(`[UploadController] FastAPI error ${status} after ${elapsed}ms: ${detail}`);
      return res.status(status).json({
        success: false,
        error:   "ML Service Error",
        message: detail,
      });
    }

    // Network / timeout — FastAPI is unreachable
    console.error(`[UploadController] FastAPI unreachable after ${elapsed}ms: ${mlErr.message}`);
    return res.status(503).json({
      success: false,
      error:   "Service Unavailable",
      message: "The ML prediction service is currently unavailable. Please try again later.",
    });
  }

  const fastapiMs = Date.now() - predictionStart;
  console.log(`[UploadController] Prediction complete — FastAPI responded in ${fastapiMs}ms.`);

  // ── 5. Merge predictions ────────────────────────────────────────────────────
  const predictions = validatedRows.map((row, i) => ({
    transaction: { Time: row.Time, Amount: row.Amount },
    prediction:  mlResult.predictions[i],
  }));

  // ── 6. Summary — single reduce() pass ──────────────────────────────────────
  const summary = mlResult.predictions.reduce(
    (acc, p) => {
      if (p.is_fraud) acc.fraudDetected++;
      else            acc.safeTransactions++;

      if      (p.risk_level === "High")   acc.highRisk++;
      else if (p.risk_level === "Medium") acc.mediumRisk++;
      else                                acc.lowRisk++;

      acc._probSum += p.fraud_probability;
      return acc;
    },
    { fraudDetected: 0, safeTransactions: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0, _probSum: 0 }
  );

  const averageFraudProbability = parseFloat((summary._probSum / validatedRows.length).toFixed(4));
  const amountAtRisk = validatedRows.reduce((sum, row, i) => {
    return mlResult.predictions[i].is_fraud ? sum + parseFloat(row.Amount) : sum;
  }, 0);

  // ── 7. Database Persistence ─────────────────────────────────────────────────
  let savedCase = null;
  try {
    const uploaderId = req.user?._id || req.body.userId;
    if (!uploaderId) {
      cleanupFile(filePath);
      return res.status(401).json({
        success: false,
        message: 'Authenticated user is required to upload files.',
      });
    }

    const caseRiskPercentage = (summary.fraudDetected / validatedRows.length) * 100;
    let computedRiskLevel = 'Low';
    if (caseRiskPercentage >= 5) computedRiskLevel = 'Critical';
    else if (caseRiskPercentage >= 2) computedRiskLevel = 'High';
    else if (caseRiskPercentage >= 0.5) computedRiskLevel = 'Medium';

    const casePayload = {
      caseId: `CASE-${Date.now()}`,
      title: req.body.title || originalname,
      description: req.body.description || `Uploaded dataset ${originalname}`,
      uploadedBy: uploaderId,
      sourceFile: originalname,
      status: 'Open',
      riskLevel: computedRiskLevel,
      riskScore: Math.min(100, Math.round(averageFraudProbability * 100)),
      amountAtRisk,
      transactionCount: validatedRows.length,
      processingStatus: 'Completed',
    };

    savedCase = await createCase(casePayload);

    const transactionsPayload = validatedRows.map((row, i) => {
      const pred = mlResult.predictions[i];
      return {
        case: savedCase._id,
        transactionId: `TXN-${Date.now()}-${i}`,
        date: new Date(),
        amount: parseFloat(row.Amount),
        merchant: 'Unknown Merchant',
        customerName: 'Unknown Customer',
        predictionProbability: pred.fraud_probability,
        riskLevel: pred.risk_level,
        isFraud: pred.is_fraud,
        status: pred.is_fraud ? 'flagged' : 'reviewed'
      };
    });

    await createTransactions(transactionsPayload);
    console.log(`[UploadController] Database persistence complete. Case: ${savedCase.caseId}`);
  } catch (dbErr) {
    console.error('[UploadController] Database error:', dbErr);
    cleanupFile(filePath);
    return res.status(500).json({
      success: false,
      message: 'Failed to save case data',
      error: dbErr.message
    });
  }

  // Clear references to large arrays before calculating processing time and constructing response
  const rowCount = validatedRows ? validatedRows.length : 0;
  validatedRows = null;
  transactions = null;

  const totalMs = Date.now() - startTime;
  console.log(`[UploadController] Total processing time: ${totalMs}ms.`);

  // ── 8. Cleanup ──────────────────────────────────────────────────────────────
  cleanupFile(filePath);

  // ── 9. Respond ──────────────────────────────────────────────────────────────
  return res.status(200).json({
    success: true,
    data: {
      case: savedCase,
      summary: {
        totalTransactions:       rowCount,
        fraudDetected:           summary.fraudDetected,
        safeTransactions:        summary.safeTransactions,
        highRisk:                summary.highRisk,
        mediumRisk:              summary.mediumRisk,
        lowRisk:                 summary.lowRisk,
        averageFraudProbability,
        amountAtRisk,
        processingTimeMs:        totalMs,
      },
      predictions,
    },
  });
}

export async function listUploads(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    // Search filter (on title)
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    // Status filter
    if (req.query.status) {
      const statusMap = {
        'Processed': 'Completed',
        'Failed': 'Failed',
        'Pending': 'Pending'
      };
      const dbStatus = statusMap[req.query.status];
      if (dbStatus) {
        filter.processingStatus = dbStatus;
      }
    }

    // File Type filter (extension regex matching title)
    if (req.query.fileType) {
      filter.title = {
        ...filter.title,
        $regex: `\\.${req.query.fileType}$`,
        $options: 'i'
      };
    }

    const total = await Case.countDocuments(filter);

    const cases = await Case.find(filter)
      .populate('uploadedBy', 'fullName role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const uploads = cases.map(c => {
      let status = 'Processed';
      if (c.processingStatus === 'Failed') status = 'Failed';
      else if (c.processingStatus === 'Pending') status = 'Pending';

      let fileType = 'CSV';
      const ext = c.title ? c.title.split('.').pop().toUpperCase() : 'CSV';
      if (['CSV', 'XLSX', 'PDF', 'JSON'].includes(ext)) {
        fileType = ext;
      }

      return {
        id: c._id,
        fileName: c.title || 'unnamed_file.csv',
        fileType,
        uploaderName: c.uploadedBy?.fullName || 'System Analyst',
        uploaderRole: c.uploadedBy?.role || 'Investigator',
        uploadedOnDate: new Date(c.createdAt).toLocaleDateString(),
        uploadedOnTime: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        records: c.transactionCount || 0,
        status,
        sizeMB: 0.05
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        uploads,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[UploadController] List Uploads Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve upload history', error: err.message });
  }
}
