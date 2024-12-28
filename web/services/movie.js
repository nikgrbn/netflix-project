const mongoose = require('mongoose');
const Movie = require("../models/movie");
const Category = require("../models/category");
const errors = require("../utils/errors");

const createMovie = async (name, categoryName) => {

  const category = await Category.findOne({ name: categoryName });
  if (!category) {
      throw new Error('Category not found');
  }

  const movie = new Movie({ name, category: category._id });
  return await movie.save();
};

const getMovies = async () => {
  return await Movie.find({});
};

const getMovieById = async (id) => {
  return await Movie.findById(id);
};

const updateMovie = async (id, updates) => {
  const movie = await getMovieById(id); // בדוק אם הסרט קיים
  if (!movie) return null;

  let categoryDoc;

  // בדוק אם הקטגוריה היא ObjectId או שם
  if (mongoose.Types.ObjectId.isValid(updates.category)) {
      categoryDoc = await Category.findById(updates.category);
  } else {
      categoryDoc = await Category.findOne({ name: updates.category });
  }

  if (!categoryDoc) {
      throw new Error(`Category "${updates.category}" not found.`);
  }

  // עדכון כל השדות פרט ל-ID
  movie.name = updates.name;
  movie.category = categoryDoc._id;

  if (updates.duration !== undefined) movie.duration = updates.duration;
  if (updates.image !== undefined) movie.image = updates.image;
  if (updates.ageLimit !== undefined) movie.ageLimit = updates.ageLimit;
  if (updates.description !== undefined) movie.description = updates.description;

  return await movie.save(); // שמור את השינויים במסד הנתונים
};





const deleteMovie = async (id) => {
  const movie = await getMovieById(id);
  if (!movie) return null;

  return await movie.deleteOne();
};

module.exports = { createMovie, getMovies, getMovieById, updateMovie, deleteMovie};
