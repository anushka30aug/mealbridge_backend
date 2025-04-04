const asyncHandler = require("express-async-handler");
const Donor = require("../../models/donor");
const { default: mongoose } = require("mongoose");
const sendResponse = require("../../utils/send_response");
const ServerError = require("../../utils/server_error");

exports.editProfile = asyncHandler(async (req, res) => {
  try {
    const { username, contact } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      throw new ServerError("Invalid user ID format", 400);
    }

    const user = await Donor.findById(req.user.id);

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

exports.addAddress = asyncHandler(async (req, res) => {
  try {
    const { address, city, state, country, postal_code } = req.body;

    if (!address || !city || !state || !country || !postal_code) {
      throw new ServerError("All address fields are required", 404);
    }

    const donor = await Donor.findById(req.user.id);

    if (!donor) {
      throw new ServerError("User not found", 404);
    }

    if (donor.address.length >= 3) {
      throw new ServerError("You can only save up to 3 addresses", 400);
    }

    donor.address.push({ address, city, state, country, postal_code });
    await donor.save();

    sendResponse(res, 200, "Address added successfully", donor.address);
  } catch (error) {
    sendResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  try {
    const { address_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      throw new ServerError("Invalid user ID format", 400);
    }

    const donor = await Donor.findById(req.user.id);
    if (!donor) {
      throw new ServerError("User not found", 404);
    }

    const addressIndex = donor.address.findIndex(
      (addr) => addr._id.toString() === address_id
    );

    if (addressIndex === -1) {
      throw new ServerError("Address not found", 404);
    }

    donor.address.splice(addressIndex, 1);
    await donor.save();

    sendResponse(res, 200, "Address deleted successfully", donor.address);
  } catch (error) {
    sendResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
});
