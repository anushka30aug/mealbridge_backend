const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Collector = new Schema(
  {
    username: { type: String, required: true },
    profilePicture: { type: String },
    contact: { type: Number, length: 10 },
    email: { type: String, unique: true, required: true },
    staticOtp: { type: String, unique: true, required: true },
    rank: { type: Number },
    donationCount: { type: Number, default: 0 },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collector", Collector);
