const movieController = require("../controllers/movie");
const recommendController = require("../controllers/recommend");
const streamController = require("../controllers/stream");
const queryController = require("../controllers/query");
const tokenController = require("../controllers/token");
const { errors } = require("../utils/consts");
const jwt = require("jsonwebtoken");
const { upload } = require("../middlewares/multer"); // Import the Multer middleware

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const express = require("express");
var router = express.Router();

// Middleware to ensure User-ID header exists
const ensureUserHeader = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ error: errors.TOKEN_REQUIRED });
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: errors.TOKEN_REQUIRED });
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

  if (req.headers["user-id"]) {
    req.userId = req.headers["user-id"];
  }
  
  next();
};

router.route("/validate").post(tokenController.validateToken);
router.route("/:id/video").get(streamController.getStreamById);

router.use(ensureUserHeader); // Apply this middleware to all routes below

router
  .route("/")
  .get(movieController.getMovies)
  .post(
    upload.fields([
      { name: "image", maxCount: 1 }, // Single image
      { name: "video", maxCount: 1 }, // Multiple videos
    ]),
    movieController.createMovie
  );

// New route for search/
router.route("/search/").get(queryController.searchMovies);

router.route("/search/:query").get(queryController.searchMovies);

router
  .route("/:id")
  .get(movieController.getMovieById)
  .put(
    upload.fields([
      { name: "image", maxCount: 1 }, // Single image
      { name: "video", maxCount: 1 }, // Multiple videos
    ]),
    movieController.setMovie
  )
  .delete(movieController.deleteMovie);

router
  .route("/:id/recommend")
  .get(recommendController.getRecommendations)
  .post(recommendController.addUserWatchedMovie);

module.exports = router;
