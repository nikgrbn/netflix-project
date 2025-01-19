
import HomeSearchBar from "./HomeSearchBar";
import DarkMode from "./DarkMode/DarkMode";
import React, { useState, useEffect } from 'react';


const HomeHeader = ({ username, profilePicture, onSearch }) => {
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      // Calculate opacity based on scroll position
      // We'll make it fully opaque by 200px of scroll
      const scrolled = Math.min(window.scrollY / 150, 1);
      setOpacity(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerStyle = {
    backgroundColor: `rgba(var(--background-secondary-color-rgb), ${opacity})`,
    boxShadow: opacity > 0 ? `0 2px 5px rgba(var(--background-secondary-color-rgb), ${opacity})` : 'none'
  };

  return (
    <header className="home-header" style={headerStyle}>
      <div className="home-header-left">
        <img src="netflix-logo.png" alt="Netflix Logo" className="netflix-logo" />
        <HomeSearchBar onSearch={onSearch} />
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
