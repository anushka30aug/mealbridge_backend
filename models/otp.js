const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  meal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true }, 
  otp: { type: String, required: true ,length:4 }, 
  createdAt: { type: Date, default: Date.now, expires: 3000 } 
});

module.exports = mongoose.model("Otp", otpSchema);
