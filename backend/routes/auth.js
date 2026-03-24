const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      username: name,
      roles: email === "jcesperanza@neu.edu.ph" ? ["user", "admin"] : ["user"]
    });

    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login with email and password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Google OAuth Login - Initiates the Google login process
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback"
  })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login-failed" }),
  async (req, res) => {
    try {
      const user = req.user;
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

      const token = jwt.sign(
        {
          id: user._id,
          roles: user.roles,
          email: user.email,
          username: user.username || user.name
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      // Redirect to frontend with token
      res.redirect(`${frontendURL}?token=${token}&user=${JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      })}`);
    } catch (error) {
      console.error("Google callback error:", error);
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendURL}?error=login_failed`);
    }
  }
);

// Login failed route
router.get("/login-failed", (req, res) => {
  res.status(401).json({ message: "Google login failed" });
});

// Manual Login route (for email login)
router.post("/google-login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Extract name from email (before @)
    const name = email.split("@")[0];
    const username = name;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: username,
        name: name,
        email: email,
        roles: email === "jcesperanza@neu.edu.ph"
          ? ["user", "admin"]
          : ["user"]
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
        email: user.email,
        username: user.username || user.name
      },
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username || user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = router;