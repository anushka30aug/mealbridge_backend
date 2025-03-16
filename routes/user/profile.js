const express = require('express');
const route = express.Router();
const fetchUser = require('../../middleware/fetchUser');
const userController = require('../../controllers/user/profile');

route.get('/fetch',fetchUser,userController.fetchProfile);
route.put('/put',fetchUser,userController.editProfile);

module.exports=route;