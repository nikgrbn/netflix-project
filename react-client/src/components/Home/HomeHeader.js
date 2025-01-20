
import HomeSearchBar from "./HomeSearchBar";
import DarkMode from "./DarkMode/DarkMode";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const HomeHeader = ({ username, profilePicture }) => {
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

  return (
    <header className="home-header" style={headerStyle}>
      <div className="home-header-left">
        <img src="netflix-logo.png" alt="Netflix Logo" className="netflix-logo" />
        <HomeSearchBar onSearch={handleSearch} />
      </div>
      <div className="home-header-right">
        <span className="username">{username}</span>
        <img src={profilePicture} alt="Profile" className="profile-picture" />
        <DarkMode />
      </div>
    </header>
  );
};

export default HomeHeader;