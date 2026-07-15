/**
 * utils/file.utils.js
 *
 * Reusable, pure helper functions for file handling.
 * No Express, no Multer, no side-effects — just utility logic.
 *
 * Keeping these functions here means multer.config.js, the controller,
 * and future modules (CSV parser, report generator) all share the same
 * helpers without duplicating code.
 */

import path from "path";
import crypto from "crypto";

// ── generateUniqueFilename ────────────────────────────────────────────────────

/**
 * Generates a safe, unique filename that cannot collide even under
 * concurrent uploads and cannot be used for directory traversal.
 *
 * Format: <timestamp>-<8-char random hex>-<sanitized original name>
 * Example: 1720000000000-a3f9c2b1-transactions.csv
 *
 * @param {string} originalName  — The original filename from the client.
 * @returns {string}             — A safe unique filename.
 */
export function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const randomHex = crypto.randomBytes(4).toString("hex"); // 8 hex chars
  const sanitized = sanitizeFilename(originalName);
  return `${timestamp}-${randomHex}-${sanitized}`;
}

// ── formatFileSize ────────────────────────────────────────────────────────────

/**
 * Converts a raw byte count into a human-readable string.
 *
 * @param {number} bytes
 * @returns {string}  e.g. "2.34 MB", "512.00 KB", "45.00 B"
 */
export function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${bytes.toFixed ? bytes.toFixed(2) : bytes} B`;
}

// ── validateCsvExtension ──────────────────────────────────────────────────────

/**
 * Returns true only if the filename ends with .csv (case-insensitive).
 * This is a secondary check — MIME type validation in Multer is the
 * primary guard, but defence-in-depth means we check both.
 *
 * @param {string} filename
 * @returns {boolean}
 */
export function validateCsvExtension(filename) {
  return path.extname(filename).toLowerCase() === ".csv";
}

// ── sanitizeFilename (internal helper) ───────────────────────────────────────

/**
 * Strips path separators and dangerous characters from a filename so it
 * can never be used for directory traversal or shell injection.
 * Only keeps alphanumeric characters, dots, dashes, and underscores.
 *
 * @param {string} filename
 * @returns {string}
 */
function sanitizeFilename(filename) {
  // Take only the base name — discard any path the client may have included.
  const base = path.basename(filename);
  // Replace any character that isn't safe with an underscore.
  return base.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}
