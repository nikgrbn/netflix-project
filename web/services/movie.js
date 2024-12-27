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

const updateMovie = async (id, name, category) => {
  const movie = await getMovieById(id);
  if (!movie) return null;

  // Update the movie fields if new values are provided
  if (name == undefined|| category == undefined) {
    return res.status(400).json({ error: errors.MOVIE_PUT_ERROR });
  }
    movie.name = name;
    movie.category = category;

  return await movie.save();
};

const deleteMovie = async (id) => {
  const movie = await getMovieById(id);
  if (!movie) return null;

  return await movie.deleteOne();
};

module.exports = { createMovie, getMovies, getMovieById, updateMovie, deleteMovie};
