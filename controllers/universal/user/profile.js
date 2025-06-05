const asyncHandler = require("express-async-handler");
const Donor = require("../../../models/donor");
const { default: mongoose } = require("mongoose");
const sendResponse = require("../../../utils/send_response");
const collector = require("../../../models/collector");
const ServerError = require("../../../utils/server_error");

exports.fetchProfile = asyncHandler(async (req, res) => {
  const userType = req.header("User-Type");
  if (!userType || !["donor", "collector"].includes(userType.toLowerCase())) {
    throw new ServerError("Invalid or missing User-Type header", 400);
  }

  const Model = userType.toLowerCase() === "donor" ? Donor : collector;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ServerError("Invalid user ID format", 400);
  }
  const user = await Model.findById(req.params.id);

  if (!user) {
    throw new ServerError("User not found", 404);
  }
  sendResponse(res, 200, "User profile fetched successfully", user);
});
