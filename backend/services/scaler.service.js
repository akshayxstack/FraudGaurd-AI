/**
 * services/scaler.service.js
 *
 * Applies scikit-learn StandardScaler transformation in Node.js.
 *
 * Formula: scaled = (value - mean) / scale
 *
 * Parameters are extracted from the trained sklearn scalers
 * (amount_scaler.pkl, time_scaler.pkl) and stored in
 * config/scaler_params.json so this service has no Python dependency.
 *
 * Why keep scaling in Node.js?
 *   The scalers are already loaded in FastAPI at startup, but exposing
 *   a /scale endpoint would add latency and coupling. Replicating the
 *   trivial StandardScaler formula here keeps the pipeline self-contained
 *   and avoids an extra HTTP round-trip per batch.
 */

import { createRequire } from "module";

const require = createRequire(import.meta.url);
const scalerParams = require("../config/scaler_params.json");

/**
 * scaleAmount(rawAmount)
 * Applies StandardScaler to a raw transaction Amount (USD).
 *
 * @param {number} rawAmount
 * @returns {number} Amount_scaled
 */
export function scaleAmount(rawAmount) {
  return (rawAmount - scalerParams.amount.mean) / scalerParams.amount.scale;
}

/**
 * scaleTime(rawTime)
 * Applies StandardScaler to a raw transaction Time (seconds from epoch of dataset).
 *
 * @param {number} rawTime
 * @returns {number} Time_scaled
 */
export function scaleTime(rawTime) {
  return (rawTime - scalerParams.time.mean) / scalerParams.time.scale;
}
