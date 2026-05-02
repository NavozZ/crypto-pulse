import { Request, Response } from "express";
import User from "../models/User";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const StripeLib = require("stripe");

// ── Stripe client ──────────────────────────────────────────────────────────
const getStripe = () => new StripeLib(process.env.STRIPE_SECRET_KEY || "");

const PRO_PRICE_CENTS = 999;
const PRO_CURRENCY    = "usd";

// ── POST /api/stripe/create-payment-intent ─────────────────────────────────
export const createPaymentIntent = async (req: any, res: Response) => {
  try {
    const stripe = getStripe();
    const user   = req.user;

    if (user.subscription === "pro") {
      return res.status(400).json({ message: "You already have Pro access" });
    }

    let customerId: string | null = user.stripeCustomerId || null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email:    user.email,
        name:     user.username,
        metadata: { userId: String(user._id) },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   PRO_PRICE_CENTS,
      currency: PRO_CURRENCY,
      customer: customerId,
      metadata: {
        userId:   String(user._id),
        username: user.username,
        plan:     "pro",
      },
      description:               "CryptoPulse Pro — Lifetime Learning Access",
      automatic_payment_methods: { enabled: true },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      amount:       PRO_PRICE_CENTS,
      currency:     PRO_CURRENCY,
    });

  } catch (error) {
    console.error("❌ Stripe PaymentIntent error:", (error as Error).message);
    return res.status(500).json({
      message: "Payment setup failed",
      error:   (error as Error).message,
    });
  }
};

// ── POST /api/stripe/webhook ───────────────────────────────────────────────
export const handleWebhook = async (req: Request, res: Response) => {
  const stripe        = getStripe();
  const sig           = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook signature failed:", (err as Error).message);
    return res.status(400).json({ message: "Webhook signature verification failed" });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const userId        = paymentIntent.metadata?.userId;

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        subscription:          "pro",
        stripePaymentIntentId: paymentIntent.id,
        subscribedAt:          new Date(),
      });
      console.log(`✅ User ${userId} upgraded to Pro`);
    }
  }

  return res.json({ received: true });
};

// ── GET /api/stripe/status ─────────────────────────────────────────────────
export const getSubscriptionStatus = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("subscription subscribedAt");
    return res.json({
      subscription: user?.subscription || "free",
      subscribedAt: user?.subscribedAt || null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get subscription status" });
  }
};