const movieServices = require("../services/movie");

// Controller to handle movie search by query
const searchMovies = async (req, res) => {
  const { query } = req.params;
  // Check if the query is empty or contains only whitespace
  if (!query || query.trim() === "") {
    return res.status(200).json()
  }

  try {
    // Call the service to search for movies
    const movies = await movieServices.searchMovies(query);

    // Map the image URLs to include the full URL
    movies.map(movie => {
      movie.image = movie.image
        ? `${req.protocol}://${req.get("host")}/${movie.image}`
        : `${req.protocol}://${req.get("host")}/uploads/movies/default-picture.jpg`;
    });

    // Return the search results
    return res.status(200).json(movies);
  } catch (error) {
    // Handle errors
    console.error("Error while searching movies:", error); 
    return res.status(500).json({ error: "Failed to search movies" });
  }
};

module.exports = { searchMovies };
