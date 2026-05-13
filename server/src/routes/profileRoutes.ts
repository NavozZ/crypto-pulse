import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getProfile,
  removeSavedForecast,
  saveForecastToProfile,
  updatePassword,
  updateProfile,
} from "../controllers/profileController";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.post("/saved-forecasts", protect, saveForecastToProfile);
router.delete("/saved-forecasts/:forecastId", protect, removeSavedForecast);

export default router;

