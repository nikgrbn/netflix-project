const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { upload } = require('../middlewares/multer'); // Import the Multer middleware

// Route to sign up a user with file upload
router.route('/')
    .post(upload.single('picture'), userController.signUpUser); // Use the middleware for handling file uploads

// Route to get a user by ID
router.route('/:id')
    .get(userController.getUserById);

module.exports = router;
