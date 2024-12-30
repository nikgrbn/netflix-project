const categoryService = require('../services/category');
const { formatDocument } = require("../utils/helpers");
const { errors }  = require('../utils/consts');

const createCategory = async (req, res) => {
    // Check if the category name field is provided
    if (!req.body.name) {
        res.status(400).json({ error: errors.CATEGORY_NAME_REQUIRED });
        return;
    }

    try {
        const category = await categoryService.createCategory(
            req.body.name, req.body.promoted);
        if (!category) { res.status(400).json({ error: errors.CATEGORY_NOT_CREATED }); }
        res.status(201).json(formatDocument(category));
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate category error
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

    // Call the getCategoryById function from categoryServices
    try {
        const category = await categoryService.getCategoryById(id);
        if (category) {
            res.status(200).json(formatDocument(category));
        } else {
            res.status(404).json({ error: errors.CATEGORY_NOT_FOUND });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, promoted } = req.body;

    try {
        const category = await categoryService.updateCategory(id, name, promoted);
        if (category) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: errors.CATEGORY_NOT_FOUND });
        }
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate category error
            res.status(400).json({ error: errors.CATEGORY_ALREADY_EXISTS });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await categoryService.deleteCategory(id);
        if (category) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: errors.CATEGORY_NOT_FOUND });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };