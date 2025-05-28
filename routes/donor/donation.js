const express = require("express");
const route = express.Router();
const tokenVerification = require("../../middleware/token_verification");
const donationController = require("../../controllers/donor/donation");

route.post("/post-meal", tokenVerification, donationController.postMeal);
route.put("/cancel-meal", tokenVerification, donationController.cancelMeal);

route.get(
  "/get-active-meal",
  tokenVerification,
  donationController.getActiveMeals
);
route.put(
  "/discard-meal-request",
  tokenVerification,
  donationController.discardMealRequest
);
route.get(
  "/get-meal-history",
  tokenVerification,
  donationController.getMealHistory
);

module.exports = route;
