const movieServices = require("../services/movie");
// Controller to handle movie search by query
const searchMovies = async (req, res) => {
  const { query } = req.params;

  try {
    // Call the service to search for movies
    const movies = await movieServices.searchMovies(query);

    // Return the search results
    return res.status(200).json(movies);
  } catch (error) {
    // Handle errors
    console.error("Error while searching movies:", error); 
    return res.status(500).json({ error: "Failed to search movies" });
  }
};

module.exports = { searchMovies };
