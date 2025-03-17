const asyncHandler = require("express-async-handler");
const Donor = require("../../models/donor");
const Receiver = require("../../models/receiver");
const { default: mongoose } = require("mongoose");
const sendResponse = require("../../utils/send_response");

exports.fetchProfile = asyncHandler(async (req, res) => {
  try {
    const userType = req.header("User-Type");
    if (!userType || !["donor", "receiver"].includes(userType.toLowerCase())) {
      res.status = 400;
      throw new Error("Invalid or missing User-Type header");
    }

    const Model = userType.toLowerCase() === "donor" ? Donor : Receiver;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status = 400;
      throw new Error("Invalid user ID format");
    }
    const user = await Model.findById(req.params.id);

    if (!user) {
      res.status = 404;
      throw new Error("user not found");
    }
    res.status = 200;
    sendResponse(res, true, "user profile fetched successfully", user);
  } catch (error) {
    sendResponse(res, false, error.message, null, error);
  }
});

exports.editProfile = asyncHandler(async (req, res) => {
  try {
    const userType = req.header("User-Type");
    if (!userType || !["donor", "receiver"].includes(userType.toLowerCase())) {
      res.status = 400;
      throw new Error("Invalid or missing User-Type header");
    }

    const { username, contact } = req.body;

    const Model = userType.toLowerCase() === "donor" ? Donor : Receiver;

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      res.status = 400;
      throw new Error("Invalid user ID format");
    }

    const user = await Model.findById(req.user.id);

    if (!user) {
      res.status = 404;
      throw new Error("user not found");
    }

    if (username !== undefined) user.username = username;
    if (contact !== undefined) user.contact = contact;
    await user.save();
    res.status = 200;
    sendResponse(res, true, "user profile updated successfully", user);
  } catch (error) {
    sendResponse(res, false, error.message, null, error);
  }
});
