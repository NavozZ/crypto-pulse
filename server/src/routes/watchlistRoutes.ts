import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  addToWatchlist,
  getWatchlist,
  getWatchlistWithPrices,
  removeFromWatchlist,
  reorderWatchlist,
} from "../controllers/watchlistController";

const router = express.Router();

router.get("/", protect, getWatchlist);
router.get("/prices", protect, getWatchlistWithPrices);
router.post("/", protect, addToWatchlist);
router.put("/reorder", protect, reorderWatchlist);
router.delete("/:coinId", protect, removeFromWatchlist);

export default router;

