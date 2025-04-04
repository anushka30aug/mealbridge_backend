const express = require("express");
const route = express.Router();
const tokenVerification = require("../../../middleware/token_verification");
const userController = require("../../../controllers/universal/user/profile");

route.get("/:id", userController.fetchProfile);

module.exports = route;
