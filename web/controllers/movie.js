const mongoose = require("mongoose");
const userServices = require("../services/user");
const movieService = require("../services/movie");
const categoryService = require("../services/category");
const { formatDocument } = require("../utils/helpers");
const { errors } = require("../utils/consts");
const { MRSClient, codes } = require("../clients/MRSClient");

/**
 * Create a new movie
 */
const createMovie = async (req, res) => {
  const { name, category, ...fields } = req.body;

  // Validate required fields
  if (!name || !category) {
    return res
      .status(400)
      .json({ error: errors.MOVIE_CATEGORY_AND_NAME_REQUIRED });
  }

  try {
    // Call the service to create a movie
    const movie = await movieService.createMovie(name, category, fields);

    if (!movie) {
      return res.status(400).json({ error: errors.MOVIE_NOT_CREATED });
    }

    // Respond with a success status
    res.status(201).send();
  } catch (error) {
    // Handle specific errors for category not found
    if (error.message === "Category not found") {
      return res.status(400).json({ error: errors.CATEGORY_NOT_FOUND });
    }

    // Handle general creation errors
    res.status(500).json({ error: errors.MOVIE_ERROR_CREATION });
  }
};

/**
 * Get movies grouped by category
 */
const getMoviesByCategory = async (req, res) => {
  try {
    // Fetch movies by category using the service
    const movies = await movieService.getMoviesByCategory(req.userId);

    // Return the movies to the client
    return res.status(200).json(movies);
  } catch (error) {
    // Handle errors during fetching
    return res.status(500).json({ error: errors.MOVIE_FETCH_ERROR });
  }
};

/**
 * Get a specific movie by its ID
 */
const getMovieById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the movie by ID
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

/**
 * Update a movie by its ID
 */
const setMovie = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Prevent modification of ID fields
  if (updates._id || updates.id) {
    return res.status(400).json({ error: errors.MOVIE_ID_MODIFY });
  }

  // Validate required fields
  if (!updates.name || !updates.category) {
    return res
      .status(400)
      .json({ error: errors.MOVIE_CATEGORY_AND_NAME_REQUIRED });
  }

  try {
    // Ensure the category exists
    const category = await categoryService.getCategoryByName(updates.category);

    if (!category) {
      return res.status(400).json({ error: errors.CATEGORY_NOT_FOUND });
    }

    // Update category to use its ID
    updates.category = category._id;

    // Update the movie
    const movie = await movieService.updateMovie(id, updates);

    if (!movie) {
      return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: errors.MOVIE_UPDATE_ERROR });
  }
};

/**
 * Delete a movie by its ID
 */
const deleteMovie = async (req, res) => {
  const movieId = req.params.id;

  let movieDetails = {};
  let usersWhoWatched = [];

  const client = new MRSClient();
  try {
    // Connect to the remote server
    await client.connect();

    // Fetch all users who watched the movie
    usersWhoWatched = await userServices.getUsersByWatchedMovie(movieId);

    for (const user of usersWhoWatched) {
      const deleteMessage = `DELETE ${user.id} ${movieId}`;
      const deleteResponse = await client.sendMessage(deleteMessage);

      if (deleteResponse.trim() !== codes.NO_CONTENT) {
        throw new Error(`Failed to delete movie for user: ${user.id}`);
      }
    }

    await client.disconnect();
  } catch (error) {
    await client.disconnect();
    return res.status(500).json({ error: errors.MOVIE_REMOTE_DELETE_ERROR });
  }

  try {
    // Fetch movie details for rollback if necessary
    movieDetails = await movieService.getMovieById(movieId);

    // Delete the movie from the database
    const movie = await movieService.deleteMovie(movieId);

    if (!movie) {
      return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    // Remove the movie from all users who watched it
    await userServices.removeMovieFromUsers(movieId);

    res.status(204).send();
  } catch (error) {
    if (movieDetails.name && movieDetails.category) {
      try {
        const { name, category, ...fields } = movieDetails;
        const categoryDoc = await categoryService.getCategoryById(category);

        await movieService.createMovie(name, categoryDoc.name, fields);
        await userServices.addMovieToSpecificUsers(usersWhoWatched, movieId);

        return res.status(500).json({ error: errors.MOVIE_ROLLBACK_SUCCESS });
      } catch (rollbackError) {
        return res.status(500).json({ error: errors.MOVIE_ROLLBACK_ERROR });
      }
    }

    return res.status(500).json({ error: errors.MOVIE_ROLLBACK_ERROR });
  }
};

module.exports = {
  createMovie,
  getMoviesByCategory,
  getMovieById,
  setMovie,
  deleteMovie,
};
