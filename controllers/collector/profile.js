const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const sendResponse = require("../../utils/send_response");
const collector = require("../../models/collector");

exports.editProfile = asyncHandler(async (req, res) => {
  try {
    const { username, contact, address, city, state, country, postal_code } = req.body;

    const Model = collector;

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      throw new ServerError("Invalid user ID format", 400);
    }

    const user = await Model.findById(req.user.id);

    if (!user) {
      throw new ServerError("User not found", 404);
    }

    if (username !== undefined) user.username = username;
    if (contact !== undefined) user.contact = contact;

    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (country !== undefined) user.country = country;
    if (postal_code !== undefined) user.postal_code = postal_code;

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

