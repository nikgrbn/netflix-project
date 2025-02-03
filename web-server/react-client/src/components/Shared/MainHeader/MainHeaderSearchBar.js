import React, { useState, useRef, useEffect } from "react";

const MainHeaderSearchBar = ({ onSearch, clearSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

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

  useEffect(() => {
    if (clearSearch) {
      setSearchTerm("");
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }, [clearSearch]);

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
          ref={inputRef}
        />
      </div>
    </form>
  );
};

export default MainHeaderSearchBar;