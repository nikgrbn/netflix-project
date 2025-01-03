const Movie = require("../models/movie");
const counterService = require("../services/counter");
const Category = require("../models/category");
const { errors, counters } = require("../utils/consts");

const createMovie = async (name, fields) => {
  const movieId = await counterService.getNextSequence(counters.C_MOVIE);
  const movie = new Movie({
    _id: movieId,
    name,
    ...fields,
  });
  return await movie.save();
};

const filterMovies = async (match, sample, lookup) => {
  return await Movie.aggregate([
    {
      $match: match,
    },
    { $sample: { size: sample } },
    {
      $lookup: lookup,
    },
  ]);
};

const getMovieById = async (id) => {
  return await Movie.findById(id).populate("categories");
};

const updateMovie = async (id, updates) => {
  const movie = await getMovieById(id);
  if (!movie) return null;

  // Update the movie fields if they are provided in the updates object
  if (updates.name !== undefined) movie.name = updates.name;
  if (updates.categories !== undefined) movie.categories = updates.categories;
  if (updates.duration !== undefined) movie.duration = updates.duration;
  if (updates.image !== undefined) movie.image = updates.image;
  if (updates.age_limit !== undefined) movie.age_limit = updates.age_limit;
  if (updates.description !== undefined)
    movie.description = updates.description;

  return await movie.save();
};

const setMovie = async (id, fields) => {
  // Get the schema default values
  const schemaDefaults = Movie.schema.obj;

  // Create a default document from the schema
  const defaultValues = {};
  for (const key in schemaDefaults) {
    if (schemaDefaults[key]?.default !== undefined) {
      defaultValues[key] =
        typeof schemaDefaults[key].default === "function"
          ? schemaDefaults[key].default() // Call the function if the default is a function
          : schemaDefaults[key].default;
    }
  }

  // Merge defaults with provided fields
  const newFields = { ...defaultValues, ...fields };

  // Update the movie, replacing unspecified fields with defaults
  const movie = await Movie.findByIdAndUpdate(id, newFields, {
    new: true,
    overwrite: true,
  });

  if (!movie) return null; // Return null if the movie does not exist
  return movie; // Return the updated movie
};

const deleteMovie = async (id) => {
  const movie = await getMovieById(id);
  if (!movie) return null;

  return await movie.deleteOne();
};

const deleteCategoryFromMovies = async (categoryId) => {
  const result = await Movie.updateMany(
    { categories: categoryId }, // Find movies with the category
    { $pull: { categories: categoryId } } // Remove the category from the array
  );

  return result;
};

const searchMovies = async (query) => {
  // Check if the query is empty or contains only whitespace
  if (!query || query.trim() === "") {
    //TODO: check response
    // Return all movies if no query is provided, including populated category names
    return await Movie.find({}).populate("categories", "name");
  }
  // Find categories that match the query (case-insensitive)
  const matchingCategories = await Category.find({
    name: { $regex: query, $options: "i" },
  });
  // Extract the category IDs from the matching categories
  const categoryIds = matchingCategories.map((cat) => cat._id);
  // Build query conditions for searching movies
  const queryConditions = {
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { age_limit: !isNaN(query) ? parseInt(query) : undefined },
      { duration: !isNaN(query) ? parseInt(query) : undefined },
      { categories: { $in: categoryIds } },
    ].filter(Boolean),
  };

  const movies = await Movie.find(queryConditions).populate(
    "categories",
    "name"
  );
  return movies.map((movie) => ({
    id: movie._id,
    name: movie.name,
    categories: movie.categories.map((cat) => cat.name),
    duration: movie.duration,
    image: movie.image,
    age_limit: movie.age_limit,
    description: movie.description,
  }));
};

module.exports = {
  createMovie,
  filterMovies,
  getMovieById,
  updateMovie,
  setMovie,
  deleteMovie,
  deleteCategoryFromMovies,
  searchMovies,
};
