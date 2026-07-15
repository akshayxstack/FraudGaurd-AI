/**
 * controllers/health.controller.js
 *
 * Handles GET /health  (simple liveness) and GET /api/health (detailed).
 */

import { checkHealth, getModelInfo } from "../services/fastapi.service.js";
import { config }                    from "../config/index.js";

/**
 * liveness — GET /health
 * Lightweight check: confirms the Express process is alive.
 * Used by load balancers and uptime monitors that just need a fast ping.
 */
export function liveness(_req, res) {
  res.status(200).json({
    success: true,
    data:    { status: "ok" },
  });
}

/**
 * healthCheck — GET /api/health
 * Full health check: queries the FastAPI ML service and returns the combined
 * status of the backend and its dependencies.
 */
export async function healthCheck(_req, res) {
  let mlHealth   = null;
  let modelInfo  = null;
  let mlStatus   = "ok";
  let mlError    = null;

  try {
    [mlHealth, modelInfo] = await Promise.all([checkHealth(), getModelInfo()]);
  } catch (err) {
    mlStatus = "unreachable";
    mlError  = err.message;
  }

  const overallStatus = mlStatus === "ok" ? "ok" : "degraded";

  return res.status(200).json({
    success: true,
    data: {
      status:    overallStatus,
      timestamp: new Date().toISOString(),
      backend: {
        status:        "ok",
        version:       "1.0.0",
        environment:   config.NODE_ENV,
        uptimeSeconds: Math.floor(process.uptime()),
      },
      mlService: {
        status:      mlStatus,
        url:         config.FASTAPI_URL,
        modelLoaded: mlHealth?.model_loaded  ?? false,
        modelVersion:mlHealth?.model_version ?? null,
        threshold:   mlHealth?.threshold     ?? null,
        ...(mlError    ? { error: mlError }         : {}),
        ...(modelInfo  ? { modelInfo }               : {}),
      },
    },
  });
}
