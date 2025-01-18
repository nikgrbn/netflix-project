import React, { useState } from "react";

const HomeSearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
  
    const handleSearch = (e) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchQuery);
      }
    };
  
    return (
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <span className="search-icon">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </form>
    );
  };

export default HomeSearchBar;
