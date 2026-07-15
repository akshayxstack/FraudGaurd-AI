/**
 * controllers/predict.controller.js
 *
 * Handles POST /api/predict — direct JSON prediction endpoint.
 * Validates the request body deeply before forwarding to FastAPI.
 */

import { predictTransactions } from "../services/fastapi.service.js";

const EXPECTED_FEATURE_COUNT = 30;

export async function predict(req, res) {
  const requestStart = Date.now();
  console.log("[PredictController] Incoming prediction request.");

  // ── Validate body ──────────────────────────────────────────────────────────
  const { transactions } = req.body;

  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    console.warn("[PredictController] Rejected — missing or empty transactions array.");
    return res.status(400).json({
      success: false,
      error:   "Bad Request",
      message: "Request body must include a non-empty 'transactions' array.",
    });
  }

  // Deep validate each transaction before making the network call.
  for (let i = 0; i < transactions.length; i++) {
    const txn = transactions[i];

    if (!txn || !Array.isArray(txn.features)) {
      return res.status(400).json({
        success: false,
        error:   "Bad Request",
        message: `Transaction at index ${i} must have a 'features' array.`,
      });
    }

    if (txn.features.length !== EXPECTED_FEATURE_COUNT) {
      return res.status(400).json({
        success: false,
        error:   "Bad Request",
        message: `Transaction at index ${i} has ${txn.features.length} feature(s); expected ${EXPECTED_FEATURE_COUNT}.`,
      });
    }

    for (let j = 0; j < txn.features.length; j++) {
      const val = txn.features[j];
      if (val === null || val === undefined || typeof val !== "number" || !isFinite(val)) {
        return res.status(400).json({
          success: false,
          error:   "Bad Request",
          message: `Transaction ${i}, feature index ${j}: value "${val}" is not a valid finite number.`,
        });
      }
    }
  }

  // ── Call FastAPI ───────────────────────────────────────────────────────────
  try {
    const result  = await predictTransactions(transactions);
    const elapsed = Date.now() - requestStart;
    console.log(`[PredictController] Prediction complete — FastAPI responded in ${elapsed}ms.`);

    return res.status(200).json({
      success: true,
      data:    result,
    });

  } catch (error) {
    const elapsed = Date.now() - requestStart;

    if (error.response) {
      const { status, data } = error.response;
      console.error(`[PredictController] FastAPI returned ${status} after ${elapsed}ms:`, data);
      return res.status(status).json({
        success: false,
        error:   "ML Service Error",
        message: data?.detail || "The ML service returned an error.",
      });
    }

    // Network error / timeout
    console.error(`[PredictController] FastAPI unreachable after ${elapsed}ms: ${error.message}`);
    return res.status(503).json({
      success: false,
      error:   "Service Unavailable",
      message: "The ML prediction service is currently unavailable. Please try again later.",
    });
  }
}
