const express = require("express");
const route = express.Router();
const tokenVerification = require("../../middleware/token_verification");
const donationController = require("../../controllers/donation/donation");

route.post("/post-meal", tokenVerification, donationController.postMeal);
route.get("/active-meal", tokenVerification, donationController.getActiveMeals);

module.exports = route;
