const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  meal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true }, // Reference to Meal
  otp: { type: String, required: true ,length:4 }, // OTP for verification
  createdAt: { type: Date, default: Date.now, expires: 3000 } // Auto-delete after 5 minutes
});

module.exports = mongoose.model("Otp", otpSchema);
