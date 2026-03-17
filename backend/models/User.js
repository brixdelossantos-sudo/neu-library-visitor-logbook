const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  college: String,
  employeeType: String,
  roles: {
    type: [String],
    default: ["user"]
  }
});

module.exports = mongoose.model("User", userSchema);