const express = require("express");
const route = express.Router();
const tokenVerification = require("../../middleware/token_verification");
const profileController = require("../../controllers/donor/profile");

route.get("/:id", profileController.getDonor);
route.put("/update", tokenVerification, profileController.editProfile);
route.put("/address", tokenVerification, profileController.addAddress);

// ! Depreciated
route.delete(
  "/address/:id",
  tokenVerification,
  profileController.deleteAddress
);
module.exports = route;
