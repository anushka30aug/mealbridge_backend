const express = require("express");
const route = express.Router();
const tokenVerification = require("../../middleware/token_verification");
const collectorController = require("../../controllers/collector/collection");

route.get(
  "/get-available-meals",
  tokenVerification,
  collectorController.getMeals
);
route.post("/book-meal", tokenVerification, collectorController.bookMeal);
route.get(
  "/get-booked-meals",
  tokenVerification,
  collectorController.viewBookedMeal
);
route.post(
  "/cancel-booked-meal",
  tokenVerification,
  collectorController.cancelBookedMeal
);
route.get(
  "/get-meal-booking-history",
  tokenVerification,
  collectorController.viewMealBookingHistory
);

module.exports = route;
