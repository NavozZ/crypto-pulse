import express from "express";
import { getForecastHistory, getAccuracyStatistics } from "../controllers/forecastHistoryController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/forecast-history?coin=bitcoin
// Returns prediction history with accuracy metrics
// Protected — requires valid JWT Bearer token
router.get("/", protect, getForecastHistory);

// GET /api/forecast-history/stats?coin=bitcoin
// Returns accuracy statistics (average, best, worst)
// Protected — requires valid JWT Bearer token
router.get("/stats", protect, getAccuracyStatistics);

export default router;
