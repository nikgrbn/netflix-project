const recommendController = require('../controllers/recommend');
const error = require('../utils/errors');

const express = require('express');
var router = express.Router();

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

router.route('/:id/recommend')
    .post(recommendController.addUserWatchedMovie);

module.exports = router;
    