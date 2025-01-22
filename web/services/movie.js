const Movie = require("../models/movie");
const counterService = require("../services/counter");
const Category = require("../models/category");
const { errors, counters } = require("../utils/consts");

const createMovie = async (name, fields) => {
  const movieId = await counterService.getNextSequence(counters.C_MOVIE);
  const movie = new Movie({
    _id: movieId,
    name,
    image: fields.picturePath || 'uploads/movies/default-picture.png',
    video: fields.picturePath || 'uploads/movies/default-picture.png',
    ...fields,
  });
  return await movie.save();
};

const filterMovies = async (match, sample, lookup) => {
  const pipeline = [
    { $match: match },
    { $lookup: lookup },
  ];

  if (sample !== undefined && sample !== null) {
    pipeline.splice(1, 0, { $sample: { size: sample } });
  }

  return await Movie.aggregate(pipeline);
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

  // Search for movies that match the query conditions
  return await Movie.find(queryConditions).populate(
    "categories",
  );
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
