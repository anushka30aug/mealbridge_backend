const asyncHandler = require("express-async-handler");
const Donor = require("../../models/donor");
const { default: mongoose } = require("mongoose");
const sendResponse = require("../../utils/send_response");
const ServerError = require("../../utils/server_error");

exports.getDonor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const donor = await Donor.findById(id);
  if (!donor) {
    throw new ServerError("Donor not found.", 404);
  }

  sendResponse(res, 200, "Donor profile fetched successfully", donor);
});

exports.editProfile = asyncHandler(async (req, res) => {
  const { username, contact } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
    throw new ServerError("Invalid user ID format", 400);
  }

  const user = await Donor.findById(req.user.userId);

  if (!user) {
    throw new ServerError("User not found", 404);
  }

  if (username !== undefined) user.username = username;
  if (contact !== undefined) user.contact = contact;

  await user.save();

  sendResponse(res, 200, "User profile updated successfully", user);
});

exports.addAddress = asyncHandler(async (req, res) => {
  const { address, city, state, country, postalCode, contact } = req.body;

  if (!address || !city || !state || !country || !postalCode) {
    throw new ServerError("All address fields are required", 400);
  }

  const donor = await Donor.findById(req.user.userId);

  if (!donor) {
    throw new ServerError("User not found", 404);
  }

  if (!donor.contact) {
    if (!contact) {
      throw new ServerError("Contact number is required", 400);
    }
    donor.contact = contact;
  }

  donor.address = { address, city, state, country, postalCode };
  await donor.save();

  sendResponse(res, 200, "Address added successfully", donor.address);
});

// ! Depreciated
exports.deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
    throw new ServerError("Invalid user ID format", 400);
  }

  const donor = await Donor.findById(req.user.userId);
  if (!donor) {
    throw new ServerError("User not found", 404);
  }

  const addressIndex = donor.address.findIndex(
    (addr) => addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    throw new ServerError("Address not found", 404);
  }

  donor.address.splice(addressIndex, 1);
  await donor.save();

  sendResponse(res, 200, "Address deleted successfully", donor.address);
});
