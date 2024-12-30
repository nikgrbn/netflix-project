const mongoose = require("mongoose");
const userServices = require("../services/user");
const movieService = require("../services/movie");
const categoryService = require("../services/category");
const { formatDocument } = require("../utils/helpers");
const { errors } = require("../utils/consts");

const createMovie = async (req, res) => {
  const { name, category, ...fields } = req.body;
  if (!name || !category) {
    return res
      .status(400)
      .json({ error: errors.MOVIE_CATEGORY_AND_NAME_REQUIRED });
  }

  try {
    const movie = await movieService.createMovie(name, category, fields);
    if (!movie) {
      return res.status(400).json({ error: errors.MOVIE_NOT_CREATED });
    }
    res.status(201).json(formatDocument(movie));
  } catch (error) {
    console.error(`Error creating movie: ${error.message}`); // TODO: Remove this line
    if (error.message === "Category not found") {
      return res.status(400).json({ error: errors.CATEGORY_NOT_FOUND });
    }
    res.status(500).json({ error: errors.MOVIE_ERROR_CREATION });
  }
};

const getMovies = async (req, res) => {
  // TODO: change implementation
  try {
    const movies = await movieService.getMovies();

    const formattedMovies = movies.map((movie) => formatDocument(movie));
    res.status(200).json(formattedMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovieById = async (req, res) => {
  // Extract movie id from request parameters
  const { id } = req.params;

  // Call the getMovieById function from movieServices
  try {
    const movie = await movieService.getMovieById(id);
    if (movie) {
      res.status(200).json(formatDocument(movie));
    } else {
      res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }
  } catch (error) {
    res.status(500).json({ error: errors.MOVIE_FETCH_ERROR });
  }
};

const setMovie = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates._id || updates.id) {
    return res.status(400).json({ error: errors.MOVIE_ID_MODIFY });
  }

  if (!updates.name || !updates.category) {
    return res
      .status(400)
      .json({ error: errors.MOVIE_CATEGORY_AND_NAME_REQUIRED });
  }

  try {
    const category = await categoryService.getCategoryByName(updates.category);
    if (!category) {
      return res.status(400).json({ error: errors.CATEGORY_NOT_FOUND });
    }
    updates.category = category._id; // Update category with the category ID

    const movie = await movieService.updateMovie(id, updates);
    if (!movie) {
      return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: errors.MOVIE_UPDATE_ERROR });
  }
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await movieService.deleteMovie(id);
    if (!movie) {
      return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }
    await userServices.removeMovieFromUsers(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: errors.MOVIE_DELETE_ERROR });
  }
};

module.exports = {
  createMovie,
  getMovies,
  getMovieById,
  setMovie,
  deleteMovie,
};
