// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.user.roles.includes("admin")) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};