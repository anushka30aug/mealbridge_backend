const express = require("express");
const route = express.Router();
const tokenVerification = require("../../middleware/token_verification");
const collectorController = require("../../controllers/collector/collection");

route.get("/view-meals", tokenVerification, collectorController.getMeals);
route.post("/book-meal", tokenVerification, collectorController.bookMeal);
route.post(
  "/cancel-booked-meal",
  tokenVerification,
  collectorController.cancelBookedMeal
);
route.get(
  "/history",
  tokenVerification,
  collectorController.viewBookingHistory
);

module.exports = route;
