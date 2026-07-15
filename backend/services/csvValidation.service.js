/**
 * services/csvValidation.service.js
 *
 * Validates the structure and content of parsed CSV data.
 *
 * Receives the output of csvParser.service.js (headers + rows) and
 * returns either a clean validated result or a list of descriptive errors.
 *
 * What this file does NOT do:
 *   - Read files from disk     (csvParser.service.js)
 *   - Call FastAPI             (fastapi.service.js)
 *   - Touch Express req/res    (controllers)
 */

// ── Expected schema ───────────────────────────────────────────────────────────

/**
 * The exact 30 columns the uploaded CSV must contain, in this exact order.
 * These are the raw feature names — Amount and Time are unscaled here.
 * Scaling (StandardScaler) is applied in services/scaler.service.js before
 * the feature vector is sent to FastAPI.
 */
export const REQUIRED_COLUMNS = [
  "Time",
  "V1","V2","V3","V4","V5","V6","V7","V8","V9","V10",
  "V11","V12","V13","V14","V15","V16","V17","V18","V19","V20",
  "V21","V22","V23","V24","V25","V26","V27","V28",
  "Amount",
];

// ── Main validation entry point ───────────────────────────────────────────────

/**
 * validateCSV(headers, rows)
 *
 * Runs all validation checks and returns a result object.
 *
 * @param {string[]} headers  — Column names from the parsed CSV.
 * @param {object[]} rows     — Parsed data rows (string values).
 * @returns {{ valid: boolean, errors: string[], rows: object[] }}
 *   - valid:  true only if ALL checks pass.
 *   - errors: human-readable list of every problem found.
 *   - rows:   numeric-coerced row objects (only present when valid is true).
 */
export function validateCSV(headers, rows) {
  const errors = [];

  // ── 1. Empty file check ──────────────────────────────────────────────────
  console.log(`[CSV Validation] Step 1: Checking for empty file or missing headers...`);
  if (!headers || headers.length === 0) {
    return {
      valid: false,
      errors: ["CSV file is empty or has no headers."],
      rows: [],
    };
  }

  if (!rows || rows.length === 0) {
    return {
      valid: false,
      errors: ["CSV file contains no data rows."],
      rows: [],
    };
  }

  // ── 2. Empty header names ────────────────────────────────────────────────
  console.log(`[CSV Validation] Step 2: Checking for empty header names...`);
  const emptyHeaders = headers.filter((h) => h === "");
  if (emptyHeaders.length > 0) {
    errors.push(`CSV contains ${emptyHeaders.length} empty header name(s). All columns must be named.`);
  }

  // ── 3. Duplicate column names ────────────────────────────────────────────
  console.log(`[CSV Validation] Step 3: Checking for duplicate column names...`);
  const seen = new Set();
  const duplicates = new Set();
  for (const h of headers) {
    if (seen.has(h)) duplicates.add(h);
    seen.add(h);
  }
  if (duplicates.size > 0) {
    errors.push(`Duplicate column(s) found: ${[...duplicates].join(", ")}.`);
  }

  // ── 4. Missing required columns ──────────────────────────────────────────
  console.log(`[CSV Validation] Step 4: Checking for missing required columns...`);
  const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    errors.push(`Missing required column(s): ${missing.join(", ")}.`);
  }

  // ── 5. Extra (unexpected) columns ────────────────────────────────────────
  console.log(`[CSV Validation] Step 5: Checking for unexpected extra columns...`);
  const extra = headers.filter((h) => !REQUIRED_COLUMNS.includes(h));
  if (extra.length > 0) {
    errors.push(`Unexpected column(s) found: ${extra.join(", ")}. Only the 30 required columns are allowed.`);
  }

  // ── 6. Column order ──────────────────────────────────────────────────────
  // Only check order if the column set is otherwise correct (missing/extra
  // columns would make an order comparison misleading).
  console.log(`[CSV Validation] Step 6: Checking for invalid column order...`);
  if (missing.length === 0 && extra.length === 0) {
    const outOfOrder = REQUIRED_COLUMNS.filter((col, idx) => headers[idx] !== col);
    if (outOfOrder.length > 0) {
      errors.push(
        `Columns are in the wrong order. ` +
        `Expected: ${REQUIRED_COLUMNS.join(", ")}. ` +
        `Got: ${headers.join(", ")}.`
      );
    }
  }

  // ── 7. Row-level validation ──────────────────────────────────────────────
  // Only run if structural checks passed — row errors on a malformed schema
  // would produce noisy, misleading messages.
  const rowErrors = [];
  const numericRows = [];

  console.log(`[CSV Validation] Step 7: Performing row-level validation (numeric values, empty cells)...`);
  if (errors.length === 0) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because row 1 is the header
      const numericRow = {};
      let rowHasError = false;

      for (const col of REQUIRED_COLUMNS) {
        const raw = row[col];

        // Empty / whitespace-only value
        if (raw === undefined || raw === null || raw.trim() === "") {
          rowErrors.push(`Row ${rowNum}, column "${col}": value is empty or missing.`);
          rowHasError = true;
          continue;
        }

        // Non-numeric value
        const num = Number(raw);
        if (!isFinite(num)) {
          rowErrors.push(`Row ${rowNum}, column "${col}": "${raw}" is not a valid number.`);
          rowHasError = true;
          continue;
        }

        numericRow[col] = num;
      }

      if (!rowHasError) {
        numericRows.push(numericRow);
      }
    }
  }

  const allErrors = [...errors, ...rowErrors];
  
  console.log(`[CSV Validation] Validation complete. Found ${allErrors.length} error(s).`);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    // Only return coerced rows when everything is clean.
    rows: allErrors.length === 0 ? numericRows : [],
  };
}
