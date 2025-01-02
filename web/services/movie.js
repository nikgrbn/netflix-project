const Movie = require("../models/movie");
const Category = require("../models/category");
const counterService = require("../services/counter");
const {
  counters,
  errors
} = require("../utils/consts");

const createMovie = async (name, category, fields) => {
  const categoryDoc = await Category.findOne({ name: category });
  if (!categoryDoc) {
    throw new Error(errors.CATEGORY_NOT_FOUND);
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

const filterMovies = async (match, sample) => {
  return await Movie.aggregate([
    {
      $match: match
    },
    { $sample: { size: sample } },
  ]);
}

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
  getMovieById,
  updateMovie,
  deleteMovie,
  filterMovies
};
