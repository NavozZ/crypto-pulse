// sentimentRoutes.ts
import express from "express";
import { getSentiment } from "../controllers/sentimentController";

const router = express.Router();

// GET /api/sentiment/:coinId
// Public endpoint - no authentication required
router.get("/:coinId", getSentiment);

export default router;
