const asyncHandler = require("express-async-handler");
const Collector = require("../../models/collector");
const ServerError = require("../../utils/server_error");
const mongoose = require("mongoose");
const sendResponse = require("../../utils/send_response");
const Meal = require("../../models/meal");

exports.getOtp = asyncHandler(async (req, res) => {
  const collectorId = req.user.userId;
  if (!mongoose.Types.ObjectId.isValid(collectorId)) {
    throw new ServerError("Invalid collector Id ", 400);
  }

  const collector = await Collector.findById(collectorId);
  if (!collector) {
    throw new ServerError("Collector not found ", 404);
  }

  sendResponse(
    res,
    200,
    "collector otp fetched successfully",
    collector.staticOtp
  );
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const { mealId, otp } = req.body;

  if (!mealId || !otp) {
    throw new ServerError("Meal ID and OTP are required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(mealId)) {
    throw new ServerError("Invalid meal ID", 400);
  }

  const meal = await Meal.findById(mealId);
  if (!meal) {
    throw new ServerError("Meal not found", 404);
  }

  if (meal.status !== "reserved") {
    throw new ServerError("Meal is not in a state to verify OTP", 400);
  }

  const collector = await Collector.findById(meal.collectorId);
  if (!collector) {
    throw new ServerError("Associated collector not found", 404);
  }

  if (collector.staticOtp !== otp) {
    throw new ServerError("Invalid OTP", 401);
  }

  meal.status = "delivered";
  await meal.save();

  sendResponse(
    res,
    200,
    "OTP verified successfully. Meal marked as delivered.",
    meal
  );
});
