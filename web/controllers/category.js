const categoryService = require("../services/category");
const movieService = require("../services/movie");
const { formatDocument, formatMongoDocument } = require("../utils/helpers");
const { errors } = require("../utils/consts");

const createCategory = async (req, res) => {
  // Check if the category name field is provided
  if (!req.body.name) {
    return res.status(400).json({ error: errors.CATEGORY_NAME_REQUIRED });
  }

  try {
    const category = await categoryService.createCategory(
      req.body.name,
      req.body.promoted
    );
    if (!category) {
      return res.status(400).json({ error: errors.CATEGORY_NOT_CREATED });
    }
    res.status(201).send();
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate category error
      return res.status(400).json({ error: errors.CATEGORY_ALREADY_EXISTS });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

const getCategories = async (req, res) => {
  try {
    const result = [];

    // Fetch all categories
    const categories = await categoryService.getCategories();
    for (const category of categories) {
      // Filter movies based on the category
      const movies = await movieService.filterMovies(
        {
          categories: { $in: [category._id] }, // Check if categoryId is in the categories array
        },
        undefined,
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
            )}/uploads/movies/default-picture.png`;

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

    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  // Extract category id from request parameters
  const { id } = req.params;

  // Call the getCategoryById function from categoryServices
  try {
    const category = await categoryService.getCategoryById(id);
    if (category) {
      res.status(200).json(formatMongoDocument(category));
    } else {
      res.status(404).json({ error: errors.CATEGORY_NOT_FOUND });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, promoted } = req.body;

  try {
    const category = await categoryService.updateCategory(id, name, promoted);
    if (category) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: errors.CATEGORY_NOT_FOUND });
    }
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate category error
      res.status(400).json({ error: errors.CATEGORY_ALREADY_EXISTS });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete category by id
    const category = await categoryService.deleteCategory(id);
    if (!category) {
      return res.status(404).json({ error: errors.CATEGORY_NOT_FOUND });
    }

    // Delete the category from all movies
    await movieService.deleteCategoryFromMovies(id);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
