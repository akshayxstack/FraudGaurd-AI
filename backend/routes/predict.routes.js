/**
 * routes/predict.routes.js
 *
 * Registers all prediction-related Express routes.
 * Connects HTTP endpoints to their controller functions.
 *
 * Mounted at /api/predict in routes/index.js.
 * Future routes (CSV upload, batch report, etc.) get added here.
 */

import { Router } from "express";
import { predict } from "../controllers/predict.controller.js";

const router = Router();

/**
 * POST /api/predict
 *
 * Accepts a JSON batch of transactions and returns fraud predictions.
 *
 * Body:
 * {
 *   "transactions": [
 *     { "features": [<30 numbers: V1–V28, Amount_scaled, Time_scaled>] }
 *   ]
 * }
 */
router.post("/", predict);

export default router;
