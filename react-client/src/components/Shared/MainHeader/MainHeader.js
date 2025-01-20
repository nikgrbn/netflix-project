
import MainHeaderSearchBar from "./MainHeaderSearchBar";
import DarkMode from "./DarkMode/DarkMode";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const MainHeader = ({ username, profilePicture }) => {
  const [opacity, setOpacity] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = Math.min(window.scrollY / 150, 1);
      setOpacity(scrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/home');
    }
  };

  const headerStyle = {
    backgroundColor: `rgba(var(--background-secondary-color-rgb), ${opacity})`,
    boxShadow: opacity > 0 ? `0 2px 5px rgba(var(--background-secondary-color-rgb), ${opacity})` : "none",
  };

  const [clearSearch, setClearSearch] = useState(false);
  useEffect(() => {
    if (clearSearch) {
      setClearSearch(false);
    }
  }, [clearSearch]);

  const handleHomeClick = () => {
    setClearSearch(true);
    navigate("/home");
  }

  const handleCategoriesClick = () => {
    // TODO: Implement categories page
    console.log("Categories page not implemented yet");
  }

  const handleLogoutClick = () => {
    localStorage.clear();
    localStorage.setItem("selectedTheme", "dark");
    navigate("/");
  }

  const handleConsoleClick = () => {
    //TODO: Implement console page
    console.log("Console page not implemented yet");
  }

  return (
    <header className="home-header" style={headerStyle}>
      <div className="home-header-left">
        <img src="netflix-logo.png" alt="Netflix Logo" className="netflix-logo" onClick={handleHomeClick} />
        <span className="header-home-label" onClick={handleHomeClick}> Home</span>
        <span className="header-home-label" onClick={handleCategoriesClick}> Categories</span>
        <span className="header-home-label" onClick={handleLogoutClick}> Logout</span>
        <span className="header-home-label" onClick={handleConsoleClick}> Console</span>
      </div>
      <div className="home-header-right">
        <MainHeaderSearchBar onSearch={handleSearch} clearSearch={clearSearch} />
        <span className="header-username">{username}</span>
        <img src={profilePicture} alt="Profile" className="profile-picture" />
        <DarkMode />
      </div>
    </header>
  );
};

export default MainHeader;