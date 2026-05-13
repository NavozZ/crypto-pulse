import express from "express";
import { getOHLCData, getMarketData } from "../controllers/marketController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/market/ohlc/:coinId?days=30
// Public endpoint for dashboard and external services
router.get("/ohlc/:coinId", getOHLCData);

// GET /api/market/data?coin=bitcoin
// Public endpoint for AI engine and external services (no auth required)
router.get("/data", getMarketData);

// GET /api/market/public/data?coin=bitcoin
// Alias for backward compatibility
router.get("/public/data", getMarketData);

export default router;
