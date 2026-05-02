import express from "express";
import { getAllIndicators, getSingleIndicator } from "../controllers/macroController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/macro/indicators  — all 4 indicators for macro dashboard
router.get("/indicators", protect, getAllIndicators);

// GET /api/macro/:indicator  — single indicator for price chart overlay
// Valid: cpi | fed_rate | dxy | unemployment
router.get("/:indicator", protect, getSingleIndicator);

export default router;
