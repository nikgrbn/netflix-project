const mongoose = require('mongoose');
const Movie = require("../models/movie");
const Category = require("../models/category");
const counterService = require('../services/counter');
const { errors, counters }  = require('../utils/consts');

const createMovie = async (name, categories, fields) => {
  const movieId = await counterService.getNextSequence(counters.C_MOVIE);
  const movie = new Movie({
    _id: movieId,
    name,
    categories: categories,
    ...fields
  });
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
  if (updates.categories !== undefined) movie.categories = updates.categories;
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

const deleteCategoryFromMovies = async (categoryId) => {
  const result = await Movie.updateMany(
    { categories: categoryId }, // Find movies with the category
    { $pull: { categories: categoryId } } // Remove the category from the array
  );

  // Delete movies with no categories left
  await Movie.deleteMany({ categories: { $size: 0 } });

  return result;
}

module.exports = { createMovie, getMovies, getMovieById, updateMovie, deleteMovie, deleteCategoryFromMovies};
