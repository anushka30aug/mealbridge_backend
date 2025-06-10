const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const Donor = new Schema(
  {
    username: { type: String, required: true },
    profilePicture: { type: String },
    contact: { type: Number, length: 10 },
    email: { type: String, unique: true, required: true },
    rank: { type: Number },
    donationCount: { type: Number },
    address: {
      type: [addressSchema],
      validate: [(arr) => arr.length <= 3, "Maximum 3 addresses allowed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", Donor);
