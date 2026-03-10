import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import User from "../models/User";

const router = express.Router();



// GET /api/admin/stats — system stats for admin dashboard
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    return res.json({
      users:    userCount,
      requests: "—",       
      uptime:   `${Math.floor(process.uptime() / 60)}m`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

// GET /api/admin/users — list all users (admin only)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
