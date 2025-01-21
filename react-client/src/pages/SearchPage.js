import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import { useLocation } from "react-router-dom";
import { fetchSearchResults } from "../services/api";

const SearchPage = () => {
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
            console.log("Search results:", searchResults);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div className="search-page">
            <h2>Search Results</h2>
            <div className="movie-grid">
                {results.map((result) => (
                    <div key={result.id} className="movie-item">
                        <img
                            src={result.image}
                            alt={result.name}
                            className="movie-img"
                        />
                        {/* <h3 className="movie-title">{result.name}</h3> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
