const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const Receiver = new Schema({
    username: { type: String, required: true },
    profilePic: { type: String },
    contact: { type: Number, length: 10 },
    rank: { type: Number },
    donationCount: { type: Number }
})
module.exports = mongoose.model('Receiver', Receiver);