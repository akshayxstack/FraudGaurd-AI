/**
 * services/fastapi.service.js
 *
 * All communication with the FastAPI ML microservice lives here.
 * No Express code. No req/res. Just Axios calls.
 *
 * Why a dedicated service file?
 *   Controllers should never know how to talk to FastAPI — they just
 *   call a function and get back data. If the FastAPI URL, auth headers,
 *   or retry logic ever changes, only this file needs updating.
 */

import axios from "axios";
import { config } from "../config/index.js";

// ── Axios client ──────────────────────────────────────────────────────────────
// A pre-configured instance shared by all functions in this file.
// baseURL and timeout are read from config — change ML_TIMEOUT_MS in
// config/index.js or the environment variable to adjust without touching code.

const fastapiClient = axios.create({
  baseURL: config.FASTAPI_URL,
  timeout: config.ML_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Interceptors for Detailed Diagnostics ──────────────────────────────
fastapiClient.interceptors.request.use(
  (reqConfig) => {
    const fullUrl = `${reqConfig.baseURL || ""}${reqConfig.url || ""}`;
    console.log(`[FastAPI Request] Outgoing ${reqConfig.method.toUpperCase()} to: ${fullUrl}`);
    if (reqConfig.data) {
      const payloadStr = JSON.stringify(reqConfig.data);
      // Log the payload up to 1000 characters to avoid console flooding with large CSVs
      console.log(`[FastAPI Request Payload] ${payloadStr.slice(0, 1000)}${payloadStr.length > 1000 ? "... (truncated)" : ""}`);
    }
    return reqConfig;
  },
  (error) => {
    console.error(`[FastAPI Request setup error]`, error);
    return Promise.reject(error);
  }
);

fastapiClient.interceptors.response.use(
  (response) => {
    console.log(`[FastAPI Response] Received status ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[FastAPI Error] Complete diagnostics:`);
    if (error.response) {
      console.error(`  - Target URL: ${error.config?.baseURL || ""}${error.config?.url || ""}`);
      console.error(`  - Status: ${error.response.status}`);
      console.error(`  - Response Body:`, JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error(`  - Target URL: ${error.config?.baseURL || ""}${error.config?.url || ""}`);
      if (error.code === "ECONNABORTED") {
        console.error(`  - Error Type: Timeout Error (configured limit was ${error.config?.timeout}ms)`);
      } else {
        console.error(`  - Error Type: Connection Error / Unreachable (${error.message})`);
      }
    } else {
      console.error(`  - Setup Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

// ── Exported service functions ────────────────────────────────────────────────

/**
 * checkHealth()
 *
 * Calls GET /health on the FastAPI service.
 * Returns the parsed response data.
 *
 * @returns {Promise<object>}
 */
export async function checkHealth() {
  const response = await fastapiClient.get("/health");
  return response.data;
}

/**
 * getModelInfo()
 *
 * Calls GET /model-info on the FastAPI service.
 * Returns metadata about the loaded XGBoost model
 * (version, threshold, expected feature count, etc.).
 *
 * @returns {Promise<object>}
 */
export async function getModelInfo() {
  const response = await fastapiClient.get("/model-info");
  return response.data;
}

/**
 * predictTransactions(transactions)
 *
 * Calls POST /predict on the FastAPI service with a batch of transactions.
 *
 * @param {Array<{ features: number[] }>} transactions
 * @returns {Promise<object>} FastAPI prediction response
 *
 * Example payload:
 * {
 *   "transactions": [
 *     { "features": [0,0,0,...] }  // 30 numbers: V1–V28, Amount_scaled, Time_scaled
 *   ]
 * }
 */
export async function predictTransactions(transactions) {
  const response = await fastapiClient.post("/predict", { transactions });
  return response.data;
}
