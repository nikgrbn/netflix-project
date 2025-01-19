import React from "react";
import { useNavigate } from "react-router-dom";

const LandingHeader = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/signin");
  };

  return (
    <header className="header-container">
      {/* <img src="/netflix-logo.png" alt="Netflix Logo" className="netflix-logo" /> */}
      <div className="header-buttons">
        <select className="language-select">
          <option value="en">English</option>
          <option value="he">עברית</option>
        </select>
        <button className="sign-in-button" onClick={handleSignInClick}>
          Sign In
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;
