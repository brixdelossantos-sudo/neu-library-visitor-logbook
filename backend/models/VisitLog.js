// models/VisitLog.js
const mongoose = require("mongoose");

const visitLogSchema = new mongoose.Schema({
  userId: String,
  visitorName: String,
  name: String,
  email: String,
  college: String,
  employeeType: String,
  reason: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("VisitLog", visitLogSchema);