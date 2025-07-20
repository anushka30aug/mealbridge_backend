const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const addressSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const Collector = new Schema(
  {
    username: { type: String, required: true },
    profilePicture: { type: String },
    contact: { type: String, length: 10 },
    email: { type: String, unique: true, required: true },
    staticOtp: { type: String, unique: true, required: true },
    rank: { type: Number },
    donationCount: { type: Number, default: 0 },
    address: { type: addressSchema },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collector", Collector);
