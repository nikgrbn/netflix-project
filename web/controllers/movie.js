const mongoose = require("mongoose");
const userServices = require("../services/user");
const movieService = require("../services/movie");
const categoryService = require("../services/category");
const { formatDocument } = require("../utils/helpers");
const { errors } = require("../utils/consts");

const createMovie = async (req, res) => {
  const { name, categories, ...fields } = req.body;
  // Check if name and categories are provided
  if (!name) {
    return res
      .status(400)
      .json({ error: errors.MOVIE_NAME_REQUIRED });
  }

  try {
    // Get the category ID for each provided category name
    if (categories) {
      const categoriesIDs = [];
      for (let name of categories) {
        const category = await categoryService.getCategoryByName(name);
        // If the category is not found, return an error
        if (!category) {
          return res.status(400).json({ error: errors.CATEGORY_NOT_FOUND });
        }
        categoriesIDs.push(category._id);
      }
      fields.categories = categoriesIDs; // Add category IDs to the fields
    }

    // Create the movie
    const movie = await movieService.createMovie(name, fields);
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
  const fields = req.body;

  if (fields._id || fields.id) {
    return res.status(400).json({ error: errors.MOVIE_ID_MODIFY });
  }

  if (!fields.name) {
    return res
      .status(400)
      .json({ error: errors.MOVIE_NAME_REQUIRED });
  }

  try {
    // Get the category ID for each provided category name
    if (fields.categories) {
      const categoriesIDs = [];
      for (let name of fields.categories) {
        const category = await categoryService.getCategoryByName(name);
        // If the category is not found, return an error
        if (!category) {
          return res.status(400).json({ error: errors.CATEGORY_NOT_FOUND });
        }
        categoriesIDs.push(category._id);
      }
      fields.categories = categoriesIDs; // Update categories with the IDs
    }

    const movie = await movieService.setMovie(id, fields);
    if (!movie) {
      return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await movieService.deleteMovie(id);
    if (!movie) {
      return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    await mongoose
      .model("User")
      .updateMany({}, { $pull: { watched_movies: id } });

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
