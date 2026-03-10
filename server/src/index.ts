import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes     from "./routes/authRoutes";
import marketRoutes   from "./routes/marketRoutes";
import forecastRoutes from "./routes/forecastRoutes";
import sentimentRoutes from "./routes/sentimentRoutes";

dotenv.config();
connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "running",
    service: "CryptoPulse API",
    routes: ["/api/auth", "/api/market", "/api/forecast", "/api/sentiment"],
  });
});

// Routes
app.use("/api/auth",      authRoutes);
app.use("/api/market",    marketRoutes);
app.use("/api/forecast",  forecastRoutes);
app.use("/api/sentiment", sentimentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
