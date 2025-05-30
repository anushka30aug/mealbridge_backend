const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    foodDesc: { type: String, required: true, maxlength: 300 },
    veg: { type: Boolean, required: true },
    feedsUpto: { type: Number, required: true, min: 3 },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: Number, required: true },
    preferredTime: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    deliveryDate: { type: Date },
    status: {
      type: String,
      enum: ["available", "reserved", "delivered", "expired", "cancelled"],
      default: "available",
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collector",
      default: null,
    },
    collectorOtp: {
      type: Number,
      ref: "Collector",
    },
  },
  { timestamps: true }
);

mealSchema.index({ status: 1 });
mealSchema.index({ donorId: 1, status: 1 });
mealSchema.index({ collectorId: 1, status: 1 });

module.exports = mongoose.model("Meal", mealSchema);
