const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const { validateFirebaseIdToken } = require('../validation');

// To manually ragister a user--
router.post('/auth/signup',authController.postSignup);

// if a user wants to change the password 
//for that user needs to be logged in first in order to do so --
router.post('/auth/reset',validateFirebaseIdToken,authController.resetPassword);

module.exports = router;