import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../services/api";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("authToken");
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(location.search).get("q");

  // Fetch search results
  useEffect(() => {
    if (query) {
      getSearchResults(query);
    }
  }, [query]);

  const getSearchResults = async (query) => {
    try {
      const searchResults = await fetchSearchResults(query, token);
      setResults(searchResults);
      console.log("Search results for:", searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Handle play button click
  const handlePlayClick = (movie) => {
    if (movie.id) {
      navigate(`/watch/${movie.id}`);
    } else {
      console.error("Movie is not available.");
    }
  };

  // Handle movie item click
  const handleMovieClick = (movie) => {
    console.log("Movie clicked:", movie);
    navigate(`/movies/${movie.id}`, {
      state: { backgroundLocation: location },
    });
  };

  return (
    <div className="search-page">
      <h2>Search Results for "{query}"</h2>
      <div className="movie-grid">
        {results.map((result) => (
          <div
            key={result.id}
            className="movie-item"
            onClick={() => handleMovieClick(result)}
          >
            <img
              src={result.image}
              alt={result.name}
              className="movie-img"
            />
            <button
              className="movie-play-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering onClick of movie item
                handlePlayClick(result);
              }}
            >
              <i className="fas fa-play"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
