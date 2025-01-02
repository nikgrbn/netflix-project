const movieController = require('../controllers/movie');
const recommendController = require('../controllers/recommend');
const { errors } = require('../utils/consts');

const express = require('express');
var router = express.Router();

// Middleware to ensure User-ID header exists
const ensureUserHeader = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ error: errors.ID_HEADER_REQUIRED });
    }
    req.userId = userId; // Attach userId to the request object for downstream use
    next();
};
router.use(ensureUserHeader); // Apply this middleware to all routes below

router.route('/')
    .get(movieController.getMovies)
    .post(movieController.createMovie);

router.route('/:id')
    .get(movieController.getMovieById)
    .put(movieController.setMovie)
    .delete(movieController.deleteMovie);

router.route('/:id/recommend')
    .get(recommendController.getRecommendations)
    .post(recommendController.addUserWatchedMovie);

module.exports = router;
    