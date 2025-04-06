const asyncHandler = require("express-async-handler");
const sendResponse = require("../../utils/send_response");
const Meal = require("../../models/meal");
const Donor = require("../../models/donor");
const ServerError = require("../../utils/server_error");
const cloudinary = require("../../config/cloudinary");

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

  const donor = await Donor.findById(req.user.id);
  if (!donor) {
    throw new ServerError("Donor not found.", 404);
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
  const donor = await Donor.findById(req.user.id);
  if (!donor) {
    throw new ServerError("Donor not found.", 404);
  }

  const activeMeals = await Meal.find({
    donorId: donor.id,
    status: { $in: ["available", "reserved"] },
  });

  return sendResponse(
    res,
    200,
    "Active meals fetched successfully",
    activeMeals
  );
});

exports.discardMealRequest = asyncHandler(async (req, res) => {
  const { mealId } = req.body;

  const meal = await Meal.findById(mealId);

  if (!meal) {
    throw new ServerError("Meal not found.", 404);
  }

  if (meal.donorId.toString() !== req.user.id) {
    throw new ServerError("Unauthorized. You don't own this meal.", 403);
  }

  if (meal.status !== "reserved" || !meal.collectorId) {
    throw new ServerError("This meal is not reserved by any receiver.", 400);
  }

  meal.status = "available";
  meal.collectorId = null;
  meal.collectorOtp=null;

  await meal.save();

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

  if (meal.donorId.toString() !== req.user.id) {
    throw new ServerError("Unauthorized. You can't cancel this meal.", 403);
  }

  if (["cancelled", "delivered", "expired"].includes(meal.status)) {
    throw new ServerError(`Cannot cancel a ${meal.status} meal.`, 400);
  }

  meal.status = "cancelled";

  await meal.save();

  // TODO: Emit socket event to collector if meal.collector_id exists
  //* io.to(collector_id).emit("meal_cancelled", { meal_id, message: "Donor has cancelled the meal." });

  return sendResponse(res, 200, "Meal cancelled successfully.", { meal });
});

exports.getMealHistory = asyncHandler(async (req, res) => {
  const donorId = req.user.id;

  const meals = await Meal.find({
    donorId: donorId,
    status: { $in: ["delivered", "cancelled", "expired"] },
  }).sort({ updatedAt: -1 }).select('-collectorOtp'); 

  return sendResponse(res, 200, "Meal history fetched successfully.", {
    meals,
  });
});
