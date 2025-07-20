const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const sendResponse = require("../../utils/send_response");
const Collector = require("../../models/collector");
const ServerError = require("../../utils/server_error");

exports.getCollector = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const collector = await Collector.findById(id);
  if (!collector) {
    throw new ServerError("Collector not found.", 404);
  }
  sendResponse(res, 200, "Collector profile fetched successfully", collector);
});

exports.editProfile = asyncHandler(async (req, res) => {
  const { username, contact, address } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
    throw new ServerError("Invalid user ID format", 400);
  }

  const user = await Collector.findById(req.user.userId);

  if (!user) {
    throw new ServerError("User not found", 404);
  }

  const anyAddressFieldPresent = !!address;
  const allAddressFieldsPresent =
    address &&
    address.address &&
    address.city &&
    address.state &&
    address.country &&
    address.postalCode;

  if (anyAddressFieldPresent && !allAddressFieldsPresent) {
    throw new ServerError(
      "All address fields (address, city, state, country, postal_code) are required for address",
      400
    );
  }

  if (username !== undefined) user.username = username;
  if (contact !== "" && contact!== undefined) user.contact = contact;

  if (allAddressFieldsPresent) {
    user.address = address;
  }

  await user.save();

  sendResponse(res, 200, "User profile updated successfully", user);
});
