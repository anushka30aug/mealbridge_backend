const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  urls: { type: [String], required: true }, // Array of image URLs
  meal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meal", required: true }, // Reference to Meal
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true }, // Reference to Donor
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Receiver", default: null } // Reference to Receiver (nullable)
}, { timestamps: true });

module.exports = mongoose.model("Image", imageSchema);
