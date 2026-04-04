import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes      from "./routes/authRoutes";
import marketRoutes    from "./routes/marketRoutes";
import forecastRoutes  from "./routes/forecastRoutes";
import sentimentRoutes from "./routes/sentimentRoutes";
import adminRoutes     from "./routes/adminRoutes";
import macroRoutes     from "./routes/macroRoutes";
import stripeRoutes    from "./routes/stripeRoutes";

dotenv.config();
connectDB();

const app: Application = express();

app.use(cors());

// ── CRITICAL: Stripe webhook needs raw body — must be before express.json() ──
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

// All other routes use JSON body parser
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    status:  "running",
    service: "CryptoPulse API",
    routes:  ["/api/auth", "/api/market", "/api/forecast", "/api/sentiment", "/api/macro", "/api/admin", "/api/stripe"],
  });
});

app.use("/api/auth",      authRoutes);
app.use("/api/market",    marketRoutes);
app.use("/api/forecast",  forecastRoutes);
app.use("/api/sentiment", sentimentRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/macro",     macroRoutes);
app.use("/api/stripe",    stripeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ CryptoPulse API running on http://localhost:${PORT}`));
