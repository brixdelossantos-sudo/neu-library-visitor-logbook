const express = require("express");
const { verifyUser } = require("../middleware/authMiddleware");
const VisitLog = require("../models/VisitLog");

const router = express.Router();

// Create a new visitor log
router.post("/", verifyUser, async (req, res) => {
  try {
    const { reason, collegeCode, employeeType } = req.body;

    if (!reason || !employeeType) {
      return res.status(400).json({ message: "Reason and category are required" });
    }

    // For non-Visitor types, college is required
    if (employeeType !== "Visitor" && !collegeCode) {
      return res.status(400).json({ message: "College is required for this category" });
    }

    const college = employeeType === "Visitor" ? "N/A" : collegeCode;

    const log = await VisitLog.create({
      userId: req.user.id,
      visitorName: req.user.email, // Username from token
      name: req.user.email,
      email: req.user.email,
      college: college,
      employeeType: employeeType,
      reason: reason,
      createdAt: new Date()
    });

    res.json({ message: "Visit logged successfully", log });
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ message: "Failed to create log" });
  }
});

// Get user's visit logs
router.get("/my-logs", verifyUser, async (req, res) => {
  try {
    const logs = await VisitLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

module.exports = router;