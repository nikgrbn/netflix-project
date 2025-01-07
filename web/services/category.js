const Category = require('../models/category');
const counterService = require('../services/counter');
const { counters }  = require('../utils/consts');

const createCategory = async (name, promoted) => {
    const categoryId = await counterService.getNextSequence(counters.C_CATEGORY); // Generate the next ID
    const category = new Category({ 
        _id: categoryId, // Assign the auto-incremented ID
        name
    });

    // If the category is promoted, set the promoted field to true
    if (promoted !== undefined) {
        category.promoted = promoted;}

    return await category.save();
}

const getCategories = async () => {
    return await Category.find({});
}

const getCategoryById = async (id) => { return await Category.findById(id); };

const getCategoryByName = async (name) => { return await Category.findOne({ name }); }

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

module.exports = { createCategory, getCategories, getCategoryById, getCategoryByName, updateCategory, deleteCategory };