import React, { useState } from "react";

const HomeSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce search
    if (onSearch) {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, 300); // Debounce time in milliseconds
    }
  };
  
    return (
      <form className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            className="search-input"
          />
        </div>
      </form>
    );
  };

export default HomeSearchBar;
