const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    urls: { type: [String], required: true }, // Array of image URLs
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    }, // Reference to Meal
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    }, // Reference to Donor
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collector",
      default: null,
    }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
