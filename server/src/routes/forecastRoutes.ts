// forecastRoutes.ts
import express from "express";
import { getForecast } from "../controllers/forecastController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/forecast/:coinId?days=90
router.get("/:coinId", protect, getForecast);

export default router;
