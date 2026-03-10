import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generateToken";

// ── POST /api/auth/register ───────────────────────────────────────────────
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "Username or email already in use" });
    }

    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // All new registrations get role: "user" by default (set in schema)
    const user = await User.create({ username, email, password: hashedPassword });

    return res.status(201).json({
      _id:      user._id,
      username: user.username,
      email:    user.email,
      role:     user.role,       // ← included so frontend can route correctly
      token:    generateToken(String(user._id)),
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      _id:      user._id,
      username: user.username,
      email:    user.email,
      role:     user.role,       // ← included so frontend can route correctly
      token:    generateToken(String(user._id)),
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};
