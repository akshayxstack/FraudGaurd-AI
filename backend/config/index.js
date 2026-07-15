import "dotenv/config";

/**
 * config/index.js
 *
 * Single source of truth for all environment-based configuration.
 * Import this object anywhere instead of reading process.env directly.
 */

export const config = {
  // ── Server ───────────────────────────────────────────────────────────
  NODE_ENV:  process.env.NODE_ENV  || "development",
  PORT:      parseInt(process.env.PORT, 10) || 5000,

  // ── Database ─────────────────────────────────────────────────────────
  MONGODB_URI: process.env.MONGODB_URI,

  // ── Authentication ───────────────────────────────────────────────────
  JWT_SECRET: process.env.JWT_SECRET || "dev-jwt-secret-do-not-use-in-prod",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // ── ML Service ───────────────────────────────────────────────────────
  FASTAPI_URL:     process.env.FASTAPI_URL     || "http://127.0.0.1:8001",
  ML_TIMEOUT_MS:   parseInt(process.env.ML_TIMEOUT_MS, 10) || 300000,

  // ── Gemini AI ────────────────────────────────────────────────────────
  GEMINI_API_KEY:  process.env.GEMINI_API_KEY,
  GEMINI_MODEL:    process.env.GEMINI_MODEL || "gemini-2.5-flash",

  // ── CORS ─────────────────────────────────────────────────────────────
  // Set to "*" in development.  In production set CORS_ORIGINS to a
  // comma-separated list of allowed origins:
  //   CORS_ORIGINS=https://fraudguard.example.com
  CORS_ORIGINS: process.env.CORS_ORIGINS || "*",

  // ── File uploads ─────────────────────────────────────────────────────
  // Single source of truth — imported by multer.config.js and
  // uploadValidation.js so changing this one value covers both.
  MAX_UPLOAD_SIZE_BYTES: parseInt(process.env.MAX_UPLOAD_SIZE_BYTES, 10) || 262144000,

  // ── Rate limiting ─────────────────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS:    parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)    || 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  RATE_LIMIT_UPLOAD_MAX:   parseInt(process.env.RATE_LIMIT_UPLOAD_MAX, 10)   || 20,
};
