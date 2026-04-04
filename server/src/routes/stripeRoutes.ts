import express from "express";
import { createPaymentIntent, handleWebhook, getSubscriptionStatus } from "../controllers/stripeController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/stripe/create-payment-intent — protected, creates Stripe PaymentIntent
router.post("/create-payment-intent", protect, createPaymentIntent);

// GET /api/stripe/status — returns subscription status for logged-in user
router.get("/status", protect, getSubscriptionStatus);

// POST /api/stripe/webhook — Stripe webhook (raw body, no JWT)
// Note: must be registered BEFORE express.json() in index.ts
router.post("/webhook", handleWebhook);

export default router;
