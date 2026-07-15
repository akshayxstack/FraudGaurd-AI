/**
 * routes/upload.routes.js
 *
 * Registers the CSV upload route and defines the middleware chain.
 *
 * Middleware order matters — each step runs in sequence:
 *
 *   1. upload.single("file")  — Multer parses the multipart body,
 *                               applies the fileFilter, enforces the
 *                               size limit, and writes the file to disk.
 *
 *   2. handleUploadErrors     — Four-argument error handler that catches
 *                               any Multer error and converts it to a
 *                               clean JSON response.
 *
 *   3. validateUpload         — Confirms req.file exists and the extension
 *                               is .csv (secondary validation layer).
 *
 *   4. uploadCsv              — Controller reads req.file metadata and
 *                               returns the success response.
 *
 * Mounted at /api/upload in routes/index.js.
 */

import { Router } from "express";
import { upload } from "../config/multer.config.js";
import { handleUploadErrors, validateUpload } from "../middleware/uploadValidation.js";
import { uploadCsv, listUploads } from "../controllers/upload.controller.js";

const router = Router();

/**
 * GET /api/upload
 *
 * Lists all processed uploads (cases).
 */
router.get("/", listUploads);

/**
 * POST /api/upload
 *
 * Accepts a multipart/form-data request with a single CSV file
 * in the "file" field.
 */
router.post(
  "/",
  upload.single("file"),   // Step 1: Multer
  handleUploadErrors,      // Step 2: Translate Multer errors → JSON
  validateUpload,          // Step 3: Final validation
  uploadCsv                // Step 4: Build and send response
);

export default router;
