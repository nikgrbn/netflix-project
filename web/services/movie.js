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

const getMoviesByCategory = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Fetch all categories and prepare a map of category IDs to names
  const allCategories = await Category.find({});
  const categoryMap = allCategories.reduce((map, category) => {
    map[category._id.toString()] = category.name;
    return map;
  }, {});

  const categories = [];
  const promotedcategories = allCategories.filter((cat) => cat.promoted);

  for (const category of promotedcategories) {
    const promotedMovies = await Movie.aggregate([
      {
        $match: { category: category._id, _id: { $nin: user.watched_movies } },
      },
      { $sample: { size: 20 } },
    ]);

    const formattedMovies = promotedMovies.map((movie) => ({
      id: movie._id,
      name: movie.name,
      category: category.name, // Replace category ID with category name
      duration: movie.duration,
      image: movie.image,
      age_limit: movie.age_limit,
      description: movie.description,
    }));

    categories.push({
      categoryId: category._id,
      categoryname: category.name,
      movies: formattedMovies,
    });
  }

  const watchmovies = await User.watched_movies;

  // Map the watched movies to include the category name
  const formattedWatchedMovies = watchmovies.map((movie) => ({
    id: movie._id,
    name: movie.name,
    category: categoryMap[movie.category.toString()], // Replace category ID with category name
    duration: movie.duration,
    image: movie.image,
    age_limit: movie.age_limit,
    description: movie.description,
  }));

  categories.push({
    categoryId: 0,
    categoryname: "movies for you",
    movies: formattedWatchedMovies.slice(-20).sort(() => Math.random() - 0.5), //TODO: comlexity
  });

  return categories;
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
