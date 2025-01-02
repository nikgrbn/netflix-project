const categoryController = require('../controllers/category');
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

router.route('/')
    .get(categoryController.getCategories);

router.route('/:id')
    .get(categoryController.getCategoryById);

router.use(ensureUserHeader); // Apply this middleware to all routes below

router.route('/')
    .post(categoryController.createCategory);

router.route('/:id')
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;
    