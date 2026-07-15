/**
 * services/csvParser.service.js
 *
 * Streams a CSV file from disk and converts it into an array of row objects.
 *
 * Why streaming?
 *   Loading the entire file into memory with fs.readFileSync() would block
 *   Node.js and fail on large files. csv-parser reads one row at a time,
 *   keeping memory usage flat regardless of file size.
 */

import fs from "fs";
import csvParser from "csv-parser";

/**
 * parseCSVFile(filePath)
 *
 * Reads a CSV file from disk using a stream and resolves with:
 *   { headers: string[], rows: object[] }
 *
 * Each row is a plain object keyed by header names, with string values.
 * Type coercion and schema validation are handled by csvValidation.service.js.
 *
 * @param {string} filePath — Absolute path to the saved CSV file.
 * @returns {Promise<{ headers: string[], rows: object[] }>}
 * @throws {Error} If the file cannot be read or the stream errors out.
 */
export function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let headers = [];

    const stream = fs.createReadStream(filePath).pipe(
      csvParser({
        mapHeaders: ({ header }) => header.trim(),
        mapValues:  ({ value  }) => value.trim(),
      })
    );

    stream.on("headers", (detectedHeaders) => {
      headers = detectedHeaders;
    });

    stream.on("data", (row) => {
      // Skip completely empty rows (all values are empty strings).
      const isEmpty = Object.values(row).every((v) => v === "");
      if (!isEmpty) rows.push(row);
    });

    stream.on("end",   () => resolve({ headers, rows }));
    stream.on("error", (err) => reject(new Error(`CSV stream error: ${err.message}`)));
  });
}
