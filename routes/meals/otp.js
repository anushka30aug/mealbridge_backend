const express = require('express');
const route = express.Router();
const tokenVerification = require('../../middleware/token_verification');
const otpController = require('../../controllers/meals/otp');

route.get('/get-otp',tokenVerification,otpController.getOtp);
route.post('/verify-otp',tokenVerification,otpController.verifyOtp);

module.exports = route;