const mongoose = require("mongoose");
const userServices = require("../services/user");
const movieService = require("../services/movie");
const categoryService = require("../services/category");
const { formatDocument } = require("../utils/helpers");
const { errors } = require("../utils/consts");
const { MRSClient, codes } = require("../clients/MRSClient");

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

// const getMovies = async (req, res) => {
//   // TODO: change implementation
//   try {
//     const movies = await movieService.getMovies();

//     const formattedMovies = movies.map((movie) => formatDocument(movie));
//     res.status(200).json(formattedMovies);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getMoviesByCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const movies = await movieService.getMoviesByCategory(userId);
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies by category:", error.message);
    res.status(500).json({ error: "Internal server error" });
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
  const movieId = req.params.id;

  let usersWhoWatched;

  try {
    const movie = await movieService.deleteMovie(movieId);
    if (!movie) {
      return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    usersWhoWatched = await userServices.getUsersByWatchedMovie(movieId);

    movieDetails = await movieService.getMovieById(movieId);
    try {
      await userServices.removeMovieFromUsers(movieId);
    } catch (error) {
      console.error("Failed to remove movie from users:", error);
      return res.status(500).json({ error: errors.USER_UPDATE_ERROR });
    }
  } catch (error) {
    return res.status(500).json({ error: errors.MOVIE_DELETE_ERROR });
  }

  const client = new MRSClient();
  try {
    await client.connect();

    const deleteMessage = `DELETE ${movieId}`;
    const deleteResponse = await client.sendMessage(deleteMessage);

    if (deleteResponse.trim() === codes.NO_CONTENT) {
      await client.disconnect();
      return res.status(204).send();
    }
    await client.disconnect();
    await userServices.addMovieToSpecificUsers(usersWhoWatched, movieId);
    await movieService.createMovie(movieDetails);
    return res.status(400).json({ error: patchResponse.trim() });
  } catch (error) {
    await client.disconnect();
    await userServices.addMovieToSpecificUsers(usersWhoWatched, movieId);
    await movieService.createMovie(movieDetails);
    return res.status(500).json({ error: errors.MRS_SERVER_ERROR });
  }
};

module.exports = {
  createMovie,
  getMoviesByCategory,
  getMovieById,
  setMovie,
  deleteMovie,
};
