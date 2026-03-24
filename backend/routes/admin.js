const express = require("express");
const { verifyUser, verifyAdmin } = require("../middleware/authMiddleware");
const VisitLog = require("../models/VisitLog");
const User = require("../models/User");

const router = express.Router();

// Get statistics
router.get("/stats", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const total = await VisitLog.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitorsToday = await VisitLog.countDocuments({
      createdAt: { $gte: today }
    });

    // Get this month's visitors
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const visitorsThisMonth = await VisitLog.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    res.json({
      total,
      visitorsToday,
      visitorsThisMonth
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Get all visitor logs (admin only)
router.get("/logs", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const logs = await VisitLog.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

// Get logs by college
router.get("/logs-by-college", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const logs = await VisitLog.aggregate([
      {
        $group: {
          _id: "$college",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs by college:", error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

// Get all users (admin only)
router.get("/users", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 })
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;