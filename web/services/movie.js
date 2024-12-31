const mongoose = require("mongoose");
const Movie = require("../models/movie");
const Category = require("../models/category");
const User = require("../models/user");
const counterService = require("../services/counter");
const { counters } = require("../utils/consts");

const createMovie = async (name, category, fields) => {
  const categoryDoc = await Category.findOne({ name: category });
  if (!categoryDoc) {
    throw new Error("Category not found");
  }

  const movieId = await counterService.getNextSequence(counters.C_MOVIE);
  const movie = new Movie({
    _id: movieId,
    name,
    category: categoryDoc._id,
    ...fields,
  });
  return await movie.save();
};

// const getMovies = async () => {
//   return await Movie.find({});
// };

const getMoviesByCategory = async (userId) => {
  const movies = {};
  const categories = await Category.find({}); 

  for (const category of categories) {
    if (category.promoted) {
    
      const promotedMovies = await Movie.find({ category: category._id })
        .limit(20)
        .exec();
      movies[category.name] = promotedMovies;
    } else {
      if (userId) {
      
        const user = await User.findById(userId).exec();
        if (!user) {
          throw new Error("User not found");
        }
        const watchedMovies = user.watched_movies || [];

        // שליפת סרטים שהמשתמש לא צפה בהם
        const unWatchedMovies = await Movie.find({
          category: category._id,
          _id: { $nin: watchedMovies }, // שלילת סרטים שצפה בהם
        })
          .limit(20)
          .exec();
        movies[category.name] = unWatchedMovies;
      } else {
        // אם אין משתמש - שליפת 20 סרטים אקראיים
        const randomMovies = await Movie.find({ category: category._id })
          .limit(20)
          .exec();
        movies[category.name] = randomMovies;
      }
    }
  }

  return movies; // החזרת כל הסרטים לפי קטגוריות
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
  if (updates.description !== undefined)
    movie.description = updates.description;

  return await movie.save();
};

const deleteMovie = async (id) => {
  const movie = await getMovieById(id);
  if (!movie) return null;

  return await movie.deleteOne();
};

module.exports = {
  createMovie,
  getMoviesByCategory,
  getMovieById,
  updateMovie,
  deleteMovie,
};
