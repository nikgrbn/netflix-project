const categoryController = require('../controllers/category');
const { errors } = require('../utils/consts');
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const express = require('express');
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
    return res.status(401).json({ error: errors.TOKEN_NOT_VALID});
  }

  // Attach user ID to the request if header present
  if (req.headers["user-id"]) {
    req.userId = req.headers["user-id"];
  }
  next();
};

router.use(ensureUserHeader); // Apply this middleware to all routes below

router.route('/')
    .get(categoryController.getCategories);

router.route('/:id')
    .get(categoryController.getCategoryById);

router.route('/')
    .post(categoryController.createCategory);

router.route('/:id')
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;
    