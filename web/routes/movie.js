const movieController = require("../controllers/movie");
const recommendController = require("../controllers/recommend");
const streamController = require("../controllers/stream");
const queryController = require("../controllers/query");
const { errors } = require("../utils/consts");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const express = require("express");
var router = express.Router();

// Middleware to ensure User-ID header exists
const ensureUserHeader = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  //console.log("Token:", token);
  if (!token) {
    return res.status(401).json({ error: errors.TOKEN_REQUIREDED });
  }
  jwt.verify(token, JWT_SECRET_KEY, (err, content) => {
    if (err) {
      req.jwtContent = undefined;
    } else {
      req.jwtContent = content;
    }
  });
  if (!req.jwtContent) {
    return res.status(401).json({ error: errors.TOKEN_NOT_VALID });
  }
  next();
};
router.use(ensureUserHeader); // Apply this middleware to all routes below

router
  .route("/")
  .get(movieController.getMovies)
  .post(movieController.createMovie);

// New route for search/
router.route("/search/").get(queryController.searchMovies);

router.route("/search/:query").get(queryController.searchMovies);

router
  .route("/:id")
  .get(movieController.getMovieById)
  .put(movieController.setMovie)
  .delete(movieController.deleteMovie);

router
  .route("/:id/recommend")
  .get(recommendController.getRecommendations)
  .post(recommendController.addUserWatchedMovie);

router.route("/:id/video").get(streamController.getStreamById);

module.exports = router;
