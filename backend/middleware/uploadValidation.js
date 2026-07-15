/**
 * middleware/uploadValidation.js
 *
 * Post-Multer error translation and secondary file validation.
 * MAX_UPLOAD_SIZE_BYTES imported from config — single source of truth.
 */

import { config }                               from "../config/index.js";
import { validateCsvExtension, formatFileSize } from "../utils/file.utils.js";

const { MAX_UPLOAD_SIZE_BYTES } = config;

/**
 * handleUploadErrors
 *
 * Four-argument Express error handler placed directly after Multer in the
 * route chain.  Translates Multer errors into consistent JSON responses.
 *
 * @type {import("express").ErrorRequestHandler}
 */
export function handleUploadErrors(err, _req, res, next) {
  if (err.code === "LIMIT_FILE_SIZE") {
    console.warn(`[UploadValidation] Rejected — file too large. Limit: ${formatFileSize(MAX_UPLOAD_SIZE_BYTES)}.`);
    return res.status(413).json({
      success: false,
      error:   "File Too Large",
      message: `Maximum upload size is ${formatFileSize(MAX_UPLOAD_SIZE_BYTES)}.`,
    });
  }

  if (err.status === 415 || (err.message && err.message.includes("CSV"))) {
    console.warn(`[UploadValidation] Rejected — unsupported type: ${err.message}`);
    return res.status(415).json({
      success: false,
      error:   "Unsupported Media Type",
      message: err.message,
    });
  }

  if (err.name === "MulterError") {
    console.error(`[UploadValidation] Multer error: ${err.message}`);
    return res.status(400).json({
      success: false,
      error:   "Upload Error",
      message: err.message,
    });
  }

  next(err);
}

/**
 * validateUpload
 *
 * Confirms req.file was populated and extension is .csv.
 * Runs only when no Multer error occurred.
 *
 * @type {import("express").RequestHandler}
 */
export function validateUpload(req, res, next) {
  if (!req.file) {
    console.warn("[UploadValidation] Rejected — no file provided.");
    return res.status(400).json({
      success: false,
      error:   "Bad Request",
      message: "No file uploaded. Send a multipart/form-data request with a 'file' field.",
    });
  }

  if (!validateCsvExtension(req.file.originalname)) {
    console.warn(`[UploadValidation] Rejected — invalid extension: ${req.file.originalname}`);
    return res.status(415).json({
      success: false,
      error:   "Unsupported Media Type",
      message: "File must have a .csv extension.",
    });
  }

  next();
}
