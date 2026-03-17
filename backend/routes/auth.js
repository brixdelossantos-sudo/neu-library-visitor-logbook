const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Login route
router.post("/google-login", async (req, res) => {
  try {
    const { email, name, username } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    // ✅ DOMAIN VALIDATION
    const allowedDomains = ["@neu.edu.ph", "@gmail.com", "@test.com"];
    const isAllowedDomain = allowedDomains.some(domain => email.endsWith(domain));
    
    if (!isAllowedDomain) {
      return res.status(403).json({ message: "Unauthorized domain" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: username || name,
        name,
        email,
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