const asyncHandler = require("express-async-handler");
const Meal = require("../../models/meal");
const Collector = require("../../models/collector");
const mongoose = require("mongoose");
const sendResponse = require("../../utils/send_response");
const ServerError = require("../../utils/server_error");
const {
  emitMealBooked,
  emitMealCancelledByCollector,
} = require("../../event/donor/donor_event");

exports.getMeals = asyncHandler(async (req, res) => {
  const collectorId = req.user.userId;

  if (!mongoose.Types.ObjectId.isValid(collectorId)) {
    throw new ServerError("Invalid collector ID", 400);
  }

  const collector = await Collector.findById(collectorId);

  if (!collector) {
    throw new ServerError("Collector not found", 404);
  }

  const { city, state } = collector.address;

  if (!city || !state) {
    throw new ServerError("Collector city or state is missing", 400);
  }

  const filters = {
    city,
    state,
    status: "available",
  };

  const { veg, minFeeds } = req.query;

  if (veg === "true") {
    filters.veg = true;
  }

  if (minFeeds) {
    filters.feedsUpto = { $gte: Number(minFeeds) };
  }

  const meals = await Meal.find(filters);

  sendResponse(res, 200, "Meals fetched successfully", meals);
});

exports.getMealById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ServerError("Invalid meal ID", 400);
  }

  const meal = await Meal.findById(id);

  if (!meal) {
    throw new ServerError("Meal not found or not accessible", 404);
  }

  sendResponse(res, 200, "Meal fetched successfully", meal);
});

exports.bookMeal = asyncHandler(async (req, res) => {
  const { mealId } = req.body;
  const collectorId = req.user.userId;

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

  const collector = await Collector.findById(collectorId);
  if (!collector) {
    throw new ServerError("Collector not found", 404);
  }
  meal.collectorId = collectorId;
  meal.collectorOtp = collector.staticOtp;
  meal.status = "reserved";

  await meal.save();
  const { donorId } = meal;

  emitMealBooked({
    donorId: donorId.toString(),
    mealId: mealId.toString(),
    collectorId: collectorId.toString(),
    collectorName: collector.username,
    foodDesc: meal.foodDesc,
    image: meal.image,
  });

  sendResponse(res, 200, "Meal booked successfully", meal);
});

exports.cancelBookedMeal = asyncHandler(async (req, res) => {
  const { mealId } = req.body;
  const collectorId = req.user.userId;
  const collector = await Collector.findById(collectorId);

  if (!collector) {
    throw new ServerError("Collector may be deleted", 404);
  }

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

  if (meal.collectorId?.toString() !== collectorId.toString()) {
    throw new ServerError("You are not authorized to cancel this booking", 403);
  }

  if (meal.status !== "reserved") {
    throw new ServerError("Only reserved meals can be cancelled", 400);
  }

  meal.collectorId = null;
  meal.collectorOtp = null;
  meal.status = "available";

  await meal.save();

  const { donorId } = meal;
  emitMealCancelledByCollector({
    donorId: donorId.toString(),
    mealId: mealId.toString(),
    collectorId: collectorId.toString(),
    collectorName: collector.username,
    foodDesc: meal.foodDesc,
    image: meal.image,
  });

  sendResponse(res, 200, "Meal booking cancelled successfully", meal);
});

exports.getBookedMeal = asyncHandler(async (req, res) => {
  const collectorId = req.user.userId;
  if (!mongoose.Types.ObjectId.isValid(collectorId)) {
    throw new ServerError("Invalid collector Id ", 400);
  }

  const meals = await Meal.find({
    collectorId: collectorId,
    status: "reserved",
  })
    .sort({ updatedAt: -1 })
    .select("-collectorOtp");

  sendResponse(res, 200, "Booked meals fetched successfully", meals);
});

exports.getMealBookingHistory = asyncHandler(async (req, res) => {
  const collectorId = req.user.userId;

  if (!mongoose.Types.ObjectId.isValid(collectorId)) {
    throw new ServerError("Invalid collector ID", 400);
  }

  const meals = await Meal.find({
    collectorId: collectorId,
    status: { $in: ["delivered", "expired", "cancelled"] },
  })
    .sort({ updatedAt: -1 })
    .select("-collectorOtp");

  sendResponse(res, 200, "Booking history fetched successfully", meals);
});
