const asyncHandler = require("express-async-handler");
const sendResponse = require("../../utils/send_response");
const Meal = require("../../models/meal");
const Donor = require("../../models/donor");
const Collector = require("../../models/collector");
const ServerError = require("../../utils/server_error");
const cloudinary = require("../../config/cloudinary");

const {
  emitMealCancelled,
  emitMealReservationCancelledByDonor,
} = require("../../event/collector/collector_event");

exports.postMeal = asyncHandler(async (req, res) => {
  const {
    image,
    foodDesc,
    veg,
    feedsUpto,
    address,
    city,
    state,
    country,
    postalCode,
    preferredTime,
    expiryDate,
  } = req.body;

  const donor = await Donor.findById(req.user.userId);
  if (!donor) {
    throw new ServerError("Donor not found.", 404);
  }

  if (new Date(expiryDate) <= new Date()) {
    throw new ServerError("Expiry date must be in the future.", 400);
  }

  if (new Date(preferredTime) <= new Date()) {
    throw new ServerError("Preferred time must be in the future.", 400);
  }

  if (new Date(preferredTime) >= new Date(expiryDate)) {
    throw new ServerError("Preferred time must be before expiry time.", 400);
  }

  let imageUrl = "";

  if (image) {
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "meals",
    });
    imageUrl = uploadResult.secure_url;
  }

  const newMeal = new Meal({
    image: imageUrl,
    donorId: donor.id,
    foodDesc,
    veg,
    feedsUpto,
    address,
    city,
    state,
    country,
    postalCode,
    preferredTime,
    expiryDate,
  });

  await newMeal.save();
  return sendResponse(res, 200, "Meal Created", { meal: newMeal });
});

exports.getActiveMeals = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.user.userId);
  if (!donor) {
    throw new ServerError("Donor not found.", 404);
  }

  const activeMeals = await Meal.find({
    donorId: donor.id,
    status: { $in: ["available", "reserved"] },
  })
    .sort({ createdAt: -1 })
    .lean();

  return sendResponse(
    res,
    200,
    "Active meals fetched successfully",
    activeMeals
  );
});

exports.getActiveMeal = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.user.userId);

  if (!donor) {
    throw new ServerError("Donor not found.", 404);
  }

  const mealId = req.params.id;

  const meal = await Meal.findOne({
    _id: mealId,
    donorId: donor.id,
  }).lean();

  if (!meal) {
    throw new ServerError("Meal not found.", 404);
  }

  if (!["available", "reserved"].includes(meal.status)) {
    throw new ServerError("Meal is not active. It is in history.", 409, {
      status: meal.status,
    });
  }

  if (meal.status === "reserved" && meal.collectorId) {
    const collector = await Collector.findById(meal.collectorId);

    if (collector) {
      meal.collector = {
        username: collector.username,
        profilePicture: collector.profilePicture,
        collectionCount: collector.donationCount,
        contact: collector.contact,
        createdAt: collector.createdAt,
      };
    }
  }

  return sendResponse(res, 200, "Active meal fetched successfully", meal);
});

exports.discardMealRequest = asyncHandler(async (req, res) => {
  const { mealId } = req.body;

  const meal = await Meal.findById(mealId);

  if (!meal) {
    throw new ServerError("Meal not found.", 404);
  }

  if (meal.donorId.toString() !== req.user.userId) {
    throw new ServerError("Unauthorized. You don't own this meal.", 403);
  }

  if (meal.status !== "reserved" || !meal.collectorId) {
    throw new ServerError("This meal is not reserved by any receiver.", 400);
  }

  meal.status = "available";
  const collectorId = meal.collectorId;
  meal.collectorId = null;
  meal.collectorOtp = null;
  await meal.save();

  emitMealReservationCancelledByDonor({
    collectorId: collectorId.toString(),
    donorId: meal.donorId.toString(),
    mealId: mealId.toString(),
    foodDesc: meal.foodDesc,
    image: meal.image,
  });

  return sendResponse(
    res,
    200,
    "Meal request discarded. It's now available again.",
    { meal }
  );
});

exports.cancelMeal = asyncHandler(async (req, res) => {
  const { mealId } = req.body;

  const meal = await Meal.findById(mealId);

  if (!meal) {
    throw new ServerError("Meal not found.", 404);
  }

  if (meal.donorId.toString() !== req.user.userId) {
    throw new ServerError("Unauthorized. You can't cancel this meal.", 403);
  }

  if (["cancelled", "delivered", "expired"].includes(meal.status)) {
    throw new ServerError(`Cannot cancel a ${meal.status} meal.`, 400);
  }

  meal.status = "cancelled";

  await meal.save();

  if (meal.collectorId) {
    emitMealCancelled({
      collectorId: meal.collectorId.toString(),
      donorId: meal.donorId.toString(),
      mealId: mealId.toString(),
      foodDesc: meal.foodDesc,
      image: meal.image,
    });
  }

  return sendResponse(res, 200, "Meal cancelled successfully.", { meal });
});

exports.getMealHistory = asyncHandler(async (req, res) => {
  const donorId = req.user.userId;

  const meals = await Meal.find({
    donorId: donorId,
    status: { $in: ["delivered", "cancelled", "expired"] },
  })
    .sort({ updatedAt: -1 })
    .select("-collectorOtp");

  return sendResponse(res, 200, "Meal history fetched successfully.", meals);
});

exports.getMealHistoryById = asyncHandler(async (req, res) => {
  const donorId = req.user.userId;
  const mealId = req.params.id;

  const meal = await Meal.findOne({
    _id: mealId,
    donorId: donorId,
  })
    .select("-collectorOtp")
    .lean();

  if (!meal) {
    throw new ServerError("Historical meal not found.", 404);
  }

  if (!["cancelled", "expired", "delivered"].includes(meal.status)) {
    throw new ServerError("Meal is active", 409, { status: meal.status });
  }

  if (meal.collectorId) {
    const collector = await Collector.findById(meal.collectorId).lean();

    if (collector) {
      meal.collector = {
        username: collector.username,
        profilePicture: collector.profilePicture,
        collectionCount: collector.donationCount,
        contact: collector.contact,
        createdAt: collector.createdAt,
      };
    }
  }

  return sendResponse(
    res,
    200,
    "Meal history item fetched successfully.",
    meal
  );
});
