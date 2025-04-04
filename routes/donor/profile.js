const express = require('express');
const route = express.Router();
const tokenVerification = require("../../middleware/token_verification");
const profileController = require('../../controllers/donor/profile');

route.post('/update',tokenVerification,profileController.editProfile);
route.post("/address", tokenVerification,profileController.addAddress);        
route.delete("/address/:id",tokenVerification, profileController.deleteAddress);
module.exports = route;