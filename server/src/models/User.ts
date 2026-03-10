import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    watchlist: [{ type: String }],

    // ── Role field ────────────────────────────────────────────────────
    // "user"  → standard retail investor — access to /dashboard only
    // "admin" → developer/admin         — access to /admin panel
    // Default is "user" for all new registrations
    role: {
      type:    String,
      enum:    ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
