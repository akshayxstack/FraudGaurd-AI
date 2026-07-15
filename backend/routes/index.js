/**
 * routes/index.js
 *
 * Central route aggregator.
 * Adding a new feature: create a route file and register it here.
 * app.js never needs to change.
 */

import { Router }     from "express";
import rateLimit      from "express-rate-limit";

import { getRoot }                       from "../controllers/root.controller.js";
import { liveness, healthCheck }         from "../controllers/health.controller.js";
import authRoutes                        from "./auth.routes.js";
import predictRoutes                     from "./predict.routes.js";
import uploadRoutes                      from "./upload.routes.js";
import dashboardRoutes                   from "./dashboard.routes.js";
import caseRoutes                        from "./case.routes.js";
import transactionRoutes                 from "./transaction.routes.js";
import assistantRoutes                   from "./assistant.routes.js";
import { config }                        from "../config/index.js";
import { requireAuth }                   from "../middleware/auth.middleware.js";

const router = Router();

// Tighter rate limit specifically for the upload route (file parsing is expensive).
const uploadLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max:      config.RATE_LIMIT_UPLOAD_MAX,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    error:   "Too Many Requests",
    message: "Upload rate limit exceeded. Please wait before uploading again.",
  },
});

// ── Public routes ─────────────────────────────────────────────────────────────

/** GET /  — service info */
router.get("/", getRoot);

/** GET /health — lightweight liveness (load-balancer friendly) */
router.get("/health", liveness);

/** GET /api/health — full health check including ML service status */
router.get("/api/health", healthCheck);

/** Auth routes */
router.use("/api/auth", authRoutes);

/** POST /api/predict — direct JSON prediction */
router.use("/api/predict", requireAuth, predictRoutes);

/** POST /api/upload — CSV upload → parse → validate → predict */
router.use("/api/upload", requireAuth, uploadLimiter, uploadRoutes);

import analyticsRoutes                   from "./analytics.routes.js";

/** GET /api/dashboard — Dashboard metrics */
router.use("/api/dashboard", requireAuth, dashboardRoutes);

/** GET /api/analytics — Analytics metrics */
router.use("/api/analytics", requireAuth, analyticsRoutes);

/** CRUD /api/cases — Case management */
router.use("/api/cases", requireAuth, caseRoutes);

/** GET /api/transactions — Transactions endpoints */
router.use("/api/transactions", requireAuth, transactionRoutes);

/** POST /api/assistant/ask — Global AI assistant */
router.use("/api/assistant", requireAuth, assistantRoutes);

export default router;
