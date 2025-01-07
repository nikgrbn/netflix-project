const User = require("../models/user");
const Movie = require("../models/movie");
const counterService = require("../services/counter");
const { errors, counters } = require("../utils/consts");

const createUser = async (username, password, picture) => {
  const userId = await counterService.getNextSequence(counters.C_USER); // Generate the next ID
  const user = new User({
    _id: userId, // Assign the auto-incremented ID
    username,
    password,
  });

  // If a picture is provided, set it as the user's picture
  if (picture) {
    user.picture = picture;
  }

  return await user.save();
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const getUserByCredentials = async (username, password) => {
  // Find the user by username (username is unique therefore only one user will be returned)
  const user = await User.findOne({ username });
  if (!user) {
    return null;
  }

  // Compare the provided password with the stored hashed password
  if (password != user.password) {
    return null;
  }

  return user;
};

const addUserWatchedMovie = async (userId, movieId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error(errors.USER_NOT_FOUND);

  const movie = await Movie.findById(movieId);
  if (!movie) throw new Error(errors.MOVIE_NOT_FOUND);

  // Check if the movie id is already in the user's watched movies array
  if (!user.watched_movies.includes(movieId)) {
    // Add the movie id to the user's watched movies array
    user.watched_movies.push(movieId);
  }

  return await user.save();
};

const removeUserWatchedMovie = async (userId, movieId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error(errors.USER_NOT_FOUND);

  const movie = await Movie.findById(movieId);
  if (!movie) throw new Error(errors.MOVIE_NOT_FOUND);

  // Remove the movie id from the user's watched movies array
  user.watched_movies = user.watched_movies.filter(
    (id) => id.toString() !== movieId
  );

  return await user.save();
};

const removeMovieFromUsers = async (movieId) => {
  return User.updateMany({}, { $pull: { watched_movies: movieId } });
};

const getUsersByWatchedMovie = async (movieId) => {
  return await User.find({ watched_movies: movieId });
};

const addMovieToSpecificUsers = async (users, movieId) => {
  const userIds = users.map((user) => user._id);
  await User.updateMany(
    { _id: { $in: userIds } },
    { $addToSet: { watched_movies: movieId } } 
  );
};

module.exports = {
  createUser,
  getUserById,
  getUserByCredentials,
  addUserWatchedMovie,
  removeUserWatchedMovie,
  removeMovieFromUsers,
  getUsersByWatchedMovie,
  addMovieToSpecificUsers,
};
