import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../services/api";

const SearchPage = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const location = useLocation();
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(location.search).get("q");

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
  const handlePlayClick = (movie) => {
    if (movie.id) {
      navigate(`/watch/${movie.id}`);
    } else {
      console.error("Movie is not available.");
    }
  };

  return (
    <div className="search-page">
      <h2>Search Results for "{query}"</h2>
      <div className="movie-grid">
        {results.map((result) => (
          <div key={result.id} className="movie-item">
            <img src={result.image} alt={result.name} className="movie-img" />
            {/* כפתור Play */}
            <button
              className="movie-play-button"
              onClick={(e) => {
                e.stopPropagation(); // מניעת אירועי קליק נוספים
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
