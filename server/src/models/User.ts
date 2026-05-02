import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username:  { type: String, required: true, unique: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true },
    watchlist: [{ type: String }],
    role: {
      type:    String,
      enum:    ["user", "admin"],
      default: "user",
    },
    // ── Subscription ────────────────────────────────────────────────
    subscription: {
      type:    String,
      enum:    ["free", "pro"],
      default: "free",
    },
    stripeCustomerId:       { type: String, default: null },
    stripePaymentIntentId:  { type: String, default: null },
    subscribedAt:           { type: Date,   default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
