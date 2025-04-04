const asyncHandler = require("express-async-handler");
const Donor = require("../../models/donor");
const Collector = require("../../models/collector");
const { default: mongoose } = require("mongoose");
const sendResponse = require("../../utils/send_response");

exports.fetchProfile = asyncHandler(async (req, res) => {
  try {
    const userType = req.header("User-Type");
    if (!userType || !["donor", "collector"].includes(userType.toLowerCase())) {
      throw new ServerError("Invalid or missing User-Type header", 400);
    }

    const Model = userType.toLowerCase() === "donor" ? Donor : Collector;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ServerError("Invalid user ID format", 400);
    }
    const user = await Model.findById(req.params.id);

    if (!user) {
      throw new ServerError("User not found", 404);
    }
    sendResponse(res, 200, "User profile fetched successfully", user);
  } catch (error) {
    sendResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
});

exports.editProfile = asyncHandler(async (req, res) => {
  try {
    const userType = req.header("User-Type");
    if (!userType || !["donor", "collector"].includes(userType.toLowerCase())) {
      throw new ServerError("Invalid or missing User-Type header", 400);
    }

    const { username, contact } = req.body;

    const Model = userType.toLowerCase() === "donor" ? Donor : Collector;

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      throw new ServerError("Invalid user ID format", 400);
    }

    const user = await Model.findById(req.user.id);

    if (!user) {
      throw new ServerError("User not found", 404);
    }

    if (username !== undefined) user.username = username;
    if (contact !== undefined) user.contact = contact;
    await user.save();
    sendResponse(res, 200, "User profile updated successfully", user);
  } catch (error) {
    sendResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
});
