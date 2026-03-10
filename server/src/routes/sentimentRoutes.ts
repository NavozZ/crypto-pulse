// sentimentRoutes.ts
import express from "express";
import { getSentiment } from "../controllers/sentimentController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/sentiment/:coinId
router.get("/:coinId", protect, getSentiment);

export default router;
