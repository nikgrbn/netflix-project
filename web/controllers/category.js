const mongoose = require('mongoose');
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

const getCategories = async (req, res) => {
    try {
        res.json(await categoryService.getCategories());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getCategoryById = async (req, res) => {
    // Extract category id from request parameters
    const { id } = req.params;

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: errors.CATEGORY_NOT_FOUND });
    }

    // Call the getCategoryById function from categoryServices
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ error: errors.CATEGORY_NOT_FOUND });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createCategory, getCategories, getCategoryById };