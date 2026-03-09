import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import marketRoutes from "./routes/marketRoutes";

dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 CryptoPulse Backend is running!");
});

// Routes
app.use("/api/auth",   authRoutes);
app.use("/api/market", marketRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
