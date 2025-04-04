const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    donor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    food_desc: { type: String, required: true, maxlength: 300 },
    veg: { type: Boolean, required: true },
    feeds_upto: { type: Number, required: true, min: 3 },
    address: { type: String, required: true },
    city: { type: String, requied: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postal_code: { type: Number, required: true },
    preferred_time: { type: Date, required: true },
    expiry_date: { type: Date, required: true },
    delivery_date: { type: Date },
    status: {
      type: String,
      enum: ["available", "reserved", "delivered", "expired", "cancelled"],
      default: "available",
    },
    collector_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collector",
      default: null,
    },
  },
  { timestamps: true }
);

mealSchema.index({ status: 1 });
mealSchema.index({ donor_id: 1, status: 1 });
mealSchema.index({ collector_id: 1, status: 1 });

module.exports = mongoose.model("Meal", mealSchema);
