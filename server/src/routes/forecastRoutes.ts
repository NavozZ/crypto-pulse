// forecastRoutes.ts
import express from "express";
import { getForecast, getForecastExplanation } from "../controllers/forecastController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:coinId/explanation", protect, getForecastExplanation);
// GET /api/forecast/:coinId?days=90
router.get("/:coinId", protect, getForecast);

export default router;
