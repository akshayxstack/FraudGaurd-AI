/**
 * controllers/root.controller.js
 *
 * Handles GET / — service identification endpoint.
 */

export function getRoot(_req, res) {
  res.status(200).json({
    success: true,
    data: {
      service: "FraudGuard AI Backend",
      version: "1.0.0",
      status:  "Running",
      endpoints: {
        health:      "GET  /health",
        fullHealth:  "GET  /api/health",
        predict:     "POST /api/predict",
        upload:      "POST /api/upload",
      },
    },
  });
}
