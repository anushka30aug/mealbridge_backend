const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const sendResponse = require("../../utils/send_response");
const Collector = require("../../models/collector");
const ServerError = require("../../utils/server_error");

exports.editProfile = asyncHandler(async (req, res) => {
  const { username, contact, address, city, state, country, postalCode } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
    // console.log(req.user);
    throw new ServerError("Invalid user ID format", 400);
  }

  const user = await Collector.findById(req.user.userId);

  if (!user) {
    throw new ServerError("User not found", 404);
  }

  //* If any address field is provided, ensure all are provided
  const anyAddressFieldPresent =
    address || city || state || country || postalCode;
  const allAddressFieldsPresent =
    address && city && state && country && postalCode;

  if (anyAddressFieldPresent && !allAddressFieldsPresent) {
    throw new ServerError(
      "All address fields (address, city, state, country, postal_code) are required for address",
      400
    );
  }

  if (username !== undefined) user.username = username;
  if (contact !== undefined) user.contact = contact;

  if (allAddressFieldsPresent) {
    user.address = address;
    user.city = city;
    user.state = state;
    user.country = country;
    user.postalCode = postalCode;
  }

  await user.save();

  sendResponse(res, 200, "User profile updated successfully", user);
});
