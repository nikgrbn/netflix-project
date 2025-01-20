import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import { useLocation } from "react-router-dom";
import HomeHeader from "../components/Home/HomeHeader";

const SearchPage = () => {
    const [results, setResults] = useState([]);
    const location = useLocation();

    const query = new URLSearchParams(location.search).get("q");

    useEffect(() => {
        if (query) {
            fetchSearchResults(query);
        }
    }, [query]);

    const fetchSearchResults = async (query) => {
        // TODO: Fetch search results
    };

    return (
        <div className="search-page">
            <ul>
                {results.map((result) => (
                    <li key={result.id}>{result.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchPage;
