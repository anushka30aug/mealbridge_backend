const express = require("express");
const route = express.Router();
const tokenVerification = require("../../middleware/token_verification");
const profileController = require("../../controllers/collector/profile");

route.get("/:id", profileController.getCollector);
route.put("/update", tokenVerification, profileController.editProfile);

module.exports = route;
