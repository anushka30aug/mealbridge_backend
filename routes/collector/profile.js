const express = require('express');
const route = express.Router();
const tokenVerification = require("../../middleware/token_verification");
const profileController = require('../../controllers/collector/profile');

route.post('/address',tokenVerification,profileController.editProfile)