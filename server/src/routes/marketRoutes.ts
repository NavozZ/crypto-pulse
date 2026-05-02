import express from "express";
import { getOHLCData } from "../controllers/marketController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/market/ohlc/:coinId?days=30
// Protected — requires valid JWT Bearer token
router.get("/ohlc/:coinId", protect, getOHLCData);

export default router;
