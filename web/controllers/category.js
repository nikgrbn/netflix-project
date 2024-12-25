const categoryService = require('../services/category');
const errors = require('../utils/errors');

const createCategory = async (req, res) => {
    // Check if the category name field is provided
    if (!req.body.name) {
        res.status(400).json({ error: errors.BAD_REQUEST });
        return;
    }

    try {
        const category = await categoryService.createCategory(
            req.body.name, req.body.promoted);
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate username error
            res.status(400).json({ error: errors.CATEGORY_ALREADY_EXISTS });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = { createCategory };