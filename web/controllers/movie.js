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

const getMoviesByCategory = async (req, res) => {
  try {
    // Fetch movies by category using the service
    const movies = await movieService.getMoviesByCategory(req.userId);

    // Return the movies to the client
    return res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies by category:", error);

    // Return an error response
    return res.status(500).json({ error: error.message });
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
  const movieId = req.params.id; // Movie ID from request parameters

  let movieDetails = {}; // To store movie details for rollback if needed
  let usersWhoWatched = []; // List of users who watched the movie

  const client = new MRSClient();
  try {
    // Connect to the remote server
    await client.connect();

    // Fetch all users who watched the movie
    usersWhoWatched = await userServices.getUsersByWatchedMovie(movieId);
    for (const user of usersWhoWatched) {
      // Send DELETE request to the remote server for each user
      const deleteMessage = `DELETE ${user.id} ${movieId}`; // Passing UserID and MovieID as arguments
      const deleteResponse = await client.sendMessage(deleteMessage);

      if (deleteResponse.trim() !== codes.NO_CONTENT) {
        console.error(`Failed to delete movie for user: ${user.id}`);
        throw new Error(`Failed to delete movie for user: ${user.id}`);
      }
    }

    // Disconnect from the remote server
    await client.disconnect();
  } catch (error) {
    // Handle errors during remote server communication
    await client.disconnect();
    console.error("Error communicating with MRS server:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete movie on remote server" });
  }

  try {
    // Fetch movie details for rollback if necessary
    movieDetails = await movieService.getMovieById(movieId);

    // Delete the movie from the database
    const movie = await movieService.deleteMovie(movieId);

    if (!movie) {
      return res.status(404).json({ error: errors.MOVIE_NOT_FOUND }); // Movie not found in database
    }

    // Remove the movie from all users who watched it
    await userServices.removeMovieFromUsers(movieId);

    // Respond with no content if successful
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting movie or updating users:", error);

    // Rollback in case of failure
    if (movieDetails.name && movieDetails.category) {
      try {
        const { name, category, ...fields } = movieDetails;
        const categoryDoc = await categoryService.getCategoryById(category);

        // Restore the movie in the database
        await movieService.createMovie(name, categoryDoc.name, fields);

        // Reassign the movie to users
        await userServices.addMovieToSpecificUsers(usersWhoWatched, movieId);
      } catch (rollbackError) {
        console.error("Error during rollback:", rollbackError);
      }
    }

    // Respond with an error
    return res
      .status(500)
      .json({ error: "Failed to delete movie and rollback failed" });
  }
};

module.exports = {
  createMovie,
  getMoviesByCategory,
  getMovieById,
  setMovie,
  deleteMovie,
};
