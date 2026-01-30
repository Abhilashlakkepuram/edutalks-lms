const mongoose = require("mongoose");

const loginActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    required: true,
  },
  state: {
    type: String,
    default: "Unknown",
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LoginActivity", loginActivitySchema);
