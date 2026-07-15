/**
 * config/multer.config.js
 *
 * Multer disk-storage configuration for CSV uploads.
 * The upload directory is resolved relative to THIS file (not the process
 * working directory) so the path is correct regardless of where node is launched.
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

import { config }                                 from "./index.js";
import { generateUniqueFilename, validateCsvExtension } from "../utils/file.utils.js";

// ── Upload directory ──────────────────────────────────────────────────────────
// __dirname equivalent for ES Modules: resolves to backend/config/
// Go one level up (..) to reach backend/uploads/
const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`[Multer] Created uploads directory at: ${UPLOADS_DIR}`);
}

// ── Disk storage ──────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),

  filename: (_req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  },
});

// ── File filter ───────────────────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = ["text/csv", "application/vnd.ms-excel"];
  const mimeOk = allowedMimeTypes.includes(file.mimetype);
  const extOk  = validateCsvExtension(file.originalname);

  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    const err    = new Error("Only CSV files are accepted (.csv with text/csv or application/vnd.ms-excel MIME type).");
    err.status   = 415;
    cb(err, false);
  }
};

// ── Multer instance ───────────────────────────────────────────────────────────
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.MAX_UPLOAD_SIZE_BYTES }, // single source of truth from config
});
