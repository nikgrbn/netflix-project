const Category = require('../models/category');

const createCategory = async (name, promoted) => {
    const category = new Category({ name: name });

    // If the category is promoted, set the promoted field to true
    if (promoted) {
        category.promoted = promoted;
    }

    return await category.save();
}

module.exports = { createCategory };