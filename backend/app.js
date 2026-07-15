/**
 * app.js
 *
 * Configures and exports the Express application.
 * Does NOT start the HTTP server — that is server.js's job.
 *
 * Middleware order (matters):
 *   1. Helmet        — security headers
 *   2. CORS          — must precede routes so pre-flight OPTIONS is handled
 *   3. Rate limiter  — applied globally; tighter limits set per-router
 *   4. Body parser   — before any route reads req.body
 *   5. Routes
 *   6. 404 handler   — after all routes
 *   7. Global error handler — last (four-argument signature)
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { config } from "./config/index.js";
import routes from "./routes/index.js";

const app = express();

// ── Trust proxy ───────────────────────────────────────────────────────────────
// Replit (and most PaaS platforms) sit behind a reverse proxy that sets the
// X-Forwarded-For header.  Without this, express-rate-limit cannot identify
// the real client IP and throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
app.set("trust proxy", 1);

// ── 1. Security headers ───────────────────────────────────────────────────────
app.use(helmet());

// ── 2. CORS ───────────────────────────────────────────────────────────────────
// Reads allowed origins from config so production can be locked down via
// the CORS_ORIGINS environment variable without touching code.
const corsOrigin =
  config.CORS_ORIGINS === "*"
    ? "*"
    : config.CORS_ORIGINS.split(",").map((o) => o.trim());

app.use(cors({ origin: corsOrigin }));

// ── 3. Global rate limiter ────────────────────────────────────────────────────
// Generous defaults — tighter limits are applied on the upload route itself.
// Does not interfere with local development (100 req / 15 min per IP).
const globalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max:      config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    error:   "Too Many Requests",
    message: "Rate limit exceeded. Please slow down and try again later.",
  },
});

app.use(globalLimiter);

// ── 4. Body parser ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ── 5. Routes ─────────────────────────────────────────────────────────────────
app.use("/", routes);

// ── 6. 404 handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error:   "Not Found",
    message: "Route not found.",
  });
});

// ── 7. Global error handler ───────────────────────────────────────────────────
// Must be registered LAST and must have four arguments so Express recognises
// it as an error-handling middleware.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const isProd = config.NODE_ENV === "production";

  console.error(`[GlobalErrorHandler] ${err.message}`);
  if (!isProd) console.error(err.stack);

  res.status(status).json({
    success: false,
    error:   err.name || "Internal Server Error",
    message: err.message || "An unexpected error occurred.",
    // Stack traces are hidden in production to avoid leaking internals.
    ...(isProd ? {} : { stack: err.stack }),
  });
});

export default app;
