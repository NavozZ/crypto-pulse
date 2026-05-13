import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getNewsAndSentiment } from "../controllers/newsSentimentController";

const router = express.Router();

router.get("/:coinId", protect, getNewsAndSentiment);

export default router;

