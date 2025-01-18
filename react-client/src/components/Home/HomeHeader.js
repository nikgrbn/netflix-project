import React from "react";
import DarkMode from "./DarkMode/DarkMode";

const HomeHeader = ({ username, profilePicture }) => {
    return (
      <header className="home-header">
        <div className="home-header-left">
          <img
            src="netflix-logo.png"
            alt="Netflix Logo"
            className="netflix-logo"
          />
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
