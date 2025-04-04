const asyncHandler = require("express-async-handler");
const sendResponse = require("../../utils/send_response");
const Meal = require("../../models/meal");
const Donor = require("../../models/donor");
const ServerError = require("../../utils/server_error");

exports.postMeal = asyncHandler(async (req, res) => {
  try {
    const {
      image,
      food_desc,
      veg,
      feeds_upto,
      address,
      preferred_time,
      expiry_date,
    } = req.body;

    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      throw new ServerError("Donor not found.", 404);
    }
    const newMeal = new Meal({
      image,
      donor_id: donor.id,
      food_desc,
      veg,
      feeds_upto,
      address,
      preferred_time,
      expiry_date,
    });

    await newMeal.save();

    return sendResponse(res, 200, "Meal Created", { meal: newMeal });
  } catch (error) {
    console.error("Error posting meal:", error);
    return sendResponse(
      res,
      error.statusCode,
      error.message || "Internal server error"
    );
  }
});

exports.getActiveMeals = asyncHandler(async (req, res) => {
  try {
    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      throw new ServerError("Donor not found.", 404);
    }

    const activeMeals = await Meal.find({
      donor_id: donor.id,
      status: { $nin: ["delivered", "expired"] },
    });

    return sendResponse(
      res,
      200,
      "Active meals fetched successfully",
      activeMeals
    );
  } catch (error) {
    console.error("Error fetching active meals:", error);
    return sendResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
});
