import express from "express";
import { getNewsAndSentiment } from "../controllers/newsSentimentController";

const router = express.Router();

// Public endpoint — sentiment data is non-sensitive market information
router.get("/:coinId", getNewsAndSentiment);

export default router;

