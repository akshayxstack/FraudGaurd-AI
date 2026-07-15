/**
 * services/featureMapper.service.js
 *
 * Converts validated CSV row objects into the exact feature format
 * the XGBoost model expects, including:
 *   1. Dropping Time and Amount from their CSV positions
 *   2. Scaling Amount and Time via StandardScaler (scaler.service.js)
 *   3. Reordering to [V1..V28, Amount_scaled, Time_scaled]
 *
 * Why the reordering?
 *   The trained model's feature_names.json defines the expected order as:
 *   [V1, V2, ..., V28, Amount_scaled, Time_scaled]
 *   The CSV schema uses [Time, V1..V28, Amount] (raw, user-friendly).
 *   This service is the single point that bridges the two.
 *
 * If the model's expected feature order ever changes, only this file needs updating.
 */

import { scaleAmount, scaleTime } from "./scaler.service.js";

/**
 * The 28 PCA feature columns in model-expected order.
 * Excludes Time and Amount — those are handled separately with scaling.
 */
const PCA_FEATURES = [
  "V1","V2","V3","V4","V5","V6","V7","V8","V9","V10",
  "V11","V12","V13","V14","V15","V16","V17","V18","V19","V20",
  "V21","V22","V23","V24","V25","V26","V27","V28",
];

/**
 * mapRowToTransaction(row)
 *
 * Input:  { Time: 406.0, V1: -1.35, ..., V28: 0.02, Amount: 149.62 }
 * Output: { features: [V1, ..., V28, Amount_scaled, Time_scaled] }  ← 30 values
 *
 * @param {object} row — Numeric-coerced row from csvValidation.service.js
 * @returns {{ features: number[] }}
 */
export function mapRowToTransaction(row) {
  const pcaValues     = PCA_FEATURES.map((col) => row[col]);
  const amountScaled  = scaleAmount(row.Amount);
  const timeScaled    = scaleTime(row.Time);

  return {
    features: [...pcaValues, amountScaled, timeScaled],
  };
}

/**
 * mapRowsToTransactions(rows)
 *
 * Converts an array of validated rows in a single pass.
 *
 * @param {object[]} rows
 * @returns {Array<{ features: number[] }>}
 */
export function mapRowsToTransactions(rows) {
  return rows.map(mapRowToTransaction);
}
