import React from "react";
import HomeSearchBar from "./HomeSearchBar";
import DarkMode from "./DarkMode/DarkMode";

const HomeHeader = ({ username, profilePicture, onSearch }) => {
  return (
    <header className="home-header">
      <div className="home-header-left">
        <img
          src="netflix-logo.png"
          alt="Netflix Logo"
          className="netflix-logo"
        />
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
