const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(userController.userSignUp);

module.exports = router;