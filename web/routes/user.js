const userController = require('../controllers/user');
const error = require('../utils/errors');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(userController.signUpUser);

router.route('/:id')
    .get(userController.getUserById);

module.exports = router;