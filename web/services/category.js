const Category = require('../models/category');

const createCategory = async (name, promoted) => {
    const category = new Category({ name: name });

    // If the category is promoted, set the promoted field to true
    if (promoted) {
        category.promoted = promoted;
    }

    return await category.save();
}

const getCategories = async () => {
    return await Category.find({});
}

const getCategoryById = async (id) => { return await Category.findById(id); };

module.exports = { createCategory, getCategories, getCategoryById };