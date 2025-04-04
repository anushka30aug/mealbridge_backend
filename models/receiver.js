const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Receiver = new Schema({
  username: { type: String, required: true },
  profilePicture: { type: String },
  contact: { type: Number, length: 10 },
  email: { type: String, unique: true, require: true },
  rank: { type: Number },
  donationCount: { type: Number },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postal_code: { type: Number },
});

module.exports = mongoose.model("Receiver", Receiver);
