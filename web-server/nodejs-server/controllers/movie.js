const userServices = require("../services/user");
const movieService = require("../services/movie");
const categoryService = require("../services/category");
const { formatDocument, formatMongoDocument } = require("../utils/helpers");
const { errors, utils } = require("../utils/consts");
const { MRSClient, codes } = require("../clients/MRSClient");

const createMovie = async (req, res) => {
  try {
    const { name, categories, ...fields } = req.body;

    // Access uploaded files
    const image = req.files?.image?.[0]?.path; // Get image path
    const video = req.files?.video?.[0]?.path; // Get all video paths

    if (!name) {
      return res.status(400).json({ error: "Movie name is required" });
    }

    // Process categories
    const categoriesIDs = [];
    if (categories) {
      const categoriesArray = Array.isArray(categories)
        ? categories
        : [categories];

      for (let categoryName of categoriesArray) {
        const category = await categoryService.getCategoryByName(categoryName);
        if (!category) {
          return res.status(400).json({ error: "Category not found" });
        }
        categoriesIDs.push(category._id);
      }
    }

    // Include files in fields
    const movieFields = {
      ...fields,
      categories: categoriesIDs,
      image,
      video,
    };

    // Create the movie
    const movie = await movieService.createMovie(name, movieFields);
    if (!movie) {
      return res.status(400).json({ error: "Failed to create movie" });
    }

    res.status(201).json({ message: "Movie created successfully", movie });
  } catch (error) {
    console.error("Error creating movie:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the movie" });
  }
};

const getMovies = async (req, res) => {
  try {
    // Fetch the user from the database
    const user = await userServices.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: errors.USER_NOT_FOUND });
    }

    const result = [];

    // Fetch all categories
    const categories = await categoryService.getCategories();

    // Fetch all movies under promoted category
    const promoted = categories.filter((cat) => cat.promoted);
    for (const category of promoted) {
      // Filter movies based on the category and user's watched movies
      const movies = await movieService.filterMovies(
        {
          categories: { $in: [category._id] }, // Check if categoryId is in the categories array
          _id: { $nin: user.watched_movies }, // Exclude movies that are in the watched movies list
        },
        utils.MAX_MOVIES,
        {
          from: "categories", // Replace the category ID with the category document
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        }
      );

      // Format the document
      const formatted = movies.map((movie) => {
        // Format the movie document
        const formattedMovie = formatDocument(movie);

        // Construct the full movie picture URL
        formattedMovie.image = formattedMovie.image
          ? `${req.protocol}://${req.get("host")}/${formattedMovie.image}`
          : `${req.protocol}://${req.get(
              "host"
            )}/uploads/movies/default-picture.jpg`;

        for (const movieCategory of formattedMovie.categories) {
          // Remove the _id field from the category document
          movieCategory.id = movieCategory._id;
          delete movieCategory._id;
        }

        return formattedMovie;
      });

      // Push the category and its movies to the result
      result.push({
        categoryId: category._id,
        categoryName: category.name,
        movies: formatted,
      });
    }

    // Fetch all movies under the unique category
    const uniqueMovies = await Promise.all(
      user.watched_movies.map(async (movieId) => {
        const movie = await movieService.getMovieById(movieId);
        const formattedMovie = formatMongoDocument(movie);

        // Construct the full movie picture URL
        formattedMovie.image = formattedMovie.image
          ? `${req.protocol}://${req.get("host")}/${formattedMovie.image}`
          : `${req.protocol}://${req.get(
              "host"
            )}/uploads/movies/default-picture.jpg`;

        return formattedMovie;
      })
    );

    // Push the unique category and its movies to the result
    result.push({
      categoryId: 0,
      categoryName: utils.UNIQUE_CATEGORY,
      movies: uniqueMovies
        .slice(-utils.MAX_MOVIES)
        .sort(() => Math.random() - 0.5),
    });

    // Return the movies to the client
    return res.status(200).json(result);
  } catch (error) {
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
      res.status(200).json(formatMongoDocument(movie));
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
    return res.status(400).json({ error: errors.MOVIE_NAME_REQUIRED });
  }

  try {
    // Get the category ID for each provided category name
    const categoriesIDs = [];
    if (fields.categories) {
      for (let name of fields.categories) {
        const category = await categoryService.getCategoryByName(name);
        // If the category is not found, return an error
        if (!category) {
          return res.status(400).json({ error: errors.CATEGORY_NOT_FOUND });
        }
        categoriesIDs.push(category._id);
      }
    }

    // Access uploaded files
    let image = req.files?.image?.[0]?.path; // Get image path
    if (!image) image = "uploads/movies/default-picture.jpg";
    let video = req.files?.video?.[0]?.path; // Get all video paths
    if (!video) video = "uploads/movies/default-video.mp4";

    // Include files in fields
    const movieFields = {
      ...fields,
      categories: categoriesIDs,
      image,
      video,
    };

    const movie = await movieService.setMovie(id, movieFields);
    if (!movie) {
      return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        return res
          .status(500)
          .json({ error: errors.MOVIE_REMOTE_DELETE_ERROR });
      }
    }

    // Disconnect from the remote server
    await client.disconnect();
  } catch (error) {
    // Handle errors during remote server communication
    await client.disconnect();
    return res.status(500).json({ error: errors.MOVIE_REMOTE_DELETE_ERROR });
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
    // Rollback in case of failure
    if (movieDetails.name) {
      try {
        const { name, ...fields } = movieDetails;

        // Restore the movie in the database
        await movieService.createMovie(name, fields);

        // Reassign the movie to users
        await userServices.addMovieToSpecificUsers(usersWhoWatched, movieId);
        return res.status(500).json({ error: errors.MOVIE_ROLLBACK_SUCCESS });
      } catch (rollbackError) {
        return res.status(500).json({ error: errors.MOVIE_ROLLBACK_ERROR });
      }
    }

    // Respond with an error
    return res.status(500).json({ error: errors.MOVIE_ROLLBACK_ERROR });
  }
};

module.exports = {
  createMovie,
  getMovies,
  getMovieById,
  setMovie,
  deleteMovie,
};
