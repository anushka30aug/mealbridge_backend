const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const Donor = new Schema({
    username: { type: String, required: true },
    profilePic: { type: String },
    contact: { type: Number, length: 10 },
    email:{type:String , unique:true , require:true},
    rank: { type: Number },
    donationCount: { type: Number }
})
module.exports = mongoose.model('Donor', Donor);