const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    image: { type: String, required: true }, // URL or file path of the meal image
    donor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true }, // Reference to Donor
    food_desc: { type: String, required: true, maxlength: 300 }, // Description of the food (max 200 characters)
    veg: { type: Boolean, required: true }, // True for veg, false for non-veg
    feeds_upto: { type: Number, required: true, min: 3 }, // At least 1 person
    address: { type: String, required: true }, // Pickup address
    preferred_time: { type: Date, required: true }, // Stores both date & time
    expiry_date: { type: Date, required: true }, // Expiration date of the meal
    delivery_date: { type: Date }, // When the meal is delivered
    status: {
        type: String,
        enum: ["available", "reserved", "delivered", "expired"],
        default: "available"
    }, // Meal status
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Receiver", default: null }, // Reference to Receiver (nullable)
}, { timestamps: true });

module.exports = mongoose.model("Meal", mealSchema);
