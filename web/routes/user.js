const userController = require('../controllers/user');
const error = require('../utils/errors');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(userController.signUpUser);

router.route('/:id')
    .get(userController.getUserById);

// Middleware to ensure User-ID header exists
const ensureUserHeader = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ error: error.ID_HEADER_REQUIRED });
    }
    req.userId = userId; // Attach userId to the request object for downstream use
    next();
};
router.use(ensureUserHeader); // Apply this middleware to all routes below

module.exports = router;