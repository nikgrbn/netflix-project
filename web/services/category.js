const Category = require('../models/category');

const createCategory = async (name, promoted) => {
    const category = new Category({ name: name });

    // If the category is promoted, set the promoted field to true
    if (promoted !== undefined) {
        category.promoted = promoted;
    }

    return await category.save();
}

const getCategories = async () => {
    return await Category.find({});
}

const getCategoryById = async (id) => { return await Category.findById(id); };

const updateCategory = async (id, name, promoted) => {
    const category = await getCategoryById(id);
    if (!category) return null;
    
    // Update the category fields if new values are provided
    if (name !== undefined) category.name = name;
    if (promoted !== undefined) category.promoted = promoted;
    
    return await category.save();
}

const deleteCategory = async (id) => {
    const category = await getCategoryById(id);
    if (!category) return null;

    return await category.deleteOne();
}

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };