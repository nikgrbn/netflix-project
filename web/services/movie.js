const mongoose = require('mongoose');
const Movie = require("../models/movie");
const Category = require("../models/category");
const { errors }  = require("../utils/consts");

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
  const movie = await getMovieById(id);
  if (!movie) return null;

  // Update the movie fields if they are provided in the updates object
  if (updates.name !== undefined) movie.name = updates.name;
  if (updates.category !== undefined) movie.category = updates.category;
  if (updates.duration !== undefined) movie.duration = updates.duration;
  if (updates.image !== undefined) movie.image = updates.image;
  if (updates.age_limit !== undefined) movie.age_limit = updates.age_limit;
  if (updates.description !== undefined) movie.description = updates.description;

  return await movie.save();
};

const deleteMovie = async (id) => {
  const movie = await getMovieById(id);
  if (!movie) return null;

  return await movie.deleteOne();
};

module.exports = { createMovie, getMovies, getMovieById, updateMovie, deleteMovie};
