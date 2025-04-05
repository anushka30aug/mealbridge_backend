const asyncHandler = require("express-async-handler");
const Meal = require("../../models/meal");
const Collector = require("../../models/collector");
const mongoose = require("mongoose");
const sendResponse = require("../../utils/send_response");
const ServerError = require("../../utils/server_error");

exports.getMeals = asyncHandler(async (req, res) => {
  const collectorId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(collectorId)) {
    throw new ServerError("Invalid collector ID", 400);
  }

  const collector = await Collector.findById(collectorId);

  if (!collector) {
    throw new ServerError("Collector not found", 404);
  }

  const { city, state } = collector;

  if (!city || !state) {
    throw new ServerError("Collector city or state is missing", 400);
  }

  const meals = await Meal.find({
    city: city,
    state: state,
    status: "available",
  });

  sendResponse(res, 200, "Meals fetched successfully", meals);
});

exports.bookMeal = asyncHandler(async (req, res) => {
  const { mealId } = req.body;
  const collectorId = req.user.id;

  if (!mealId) {
    throw new ServerError("Meal ID is required", 400);
  }

  if (
    !mongoose.Types.ObjectId.isValid(mealId) ||
    !mongoose.Types.ObjectId.isValid(collectorId)
  ) {
    throw new ServerError("Invalid meal or collector ID", 400);
  }

  const meal = await Meal.findById(mealId);

  if (!meal) {
    throw new ServerError("Meal not found", 404);
  }

  if (meal.status !== "available") {
    throw new ServerError("Meal is not available for booking", 400);
  }

  meal.collector_id = collectorId;
  meal.status = "reserved";

  await meal.save();

  sendResponse(res, 200, "Meal booked successfully", meal);
});

exports.cancelBookedMeal = asyncHandler(async (req, res) => {
  const { mealId } = req.body;
  const collectorId = req.user.id;

  if (!mealId) {
    throw new ServerError("Meal ID is required", 400);
  }

  if (
    !mongoose.Types.ObjectId.isValid(mealId) ||
    !mongoose.Types.ObjectId.isValid(collectorId)
  ) {
    throw new ServerError("Invalid meal or collector ID", 400);
  }

  const meal = await Meal.findById(mealId);

  if (!meal) {
    throw new ServerError("Meal not found", 404);
  }

  if (meal.collector_id?.toString() !== collectorId.toString()) {
    throw new ServerError("You are not authorized to cancel this booking", 403);
  }

  if (meal.status !== "reserved") {
    throw new ServerError("Only reserved meals can be cancelled", 400);
  }

  meal.collector_id = null;
  meal.status = "available";

  await meal.save();

  sendResponse(res, 200, "Meal booking cancelled successfully", meal);
});

exports.viewBookingHistory = asyncHandler(async (req, res) => {
  const collectorId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(collectorId)) {
    throw new ServerError("Invalid collector ID", 400);
  }

  const meals = await Meal.find({
    collector_id: collectorId,
    status: { $in: ["delivered", "expired", "cancelled"] },
  }).sort({ updatedAt: -1 });

  sendResponse(res, 200, "Booking history fetched successfully", meals);
});
