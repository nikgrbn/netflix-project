import React from "react";
import { useNavigate } from "react-router-dom";

const LandingHeader = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/signin");
  };

  return (
    <header className="header-container">
      <img 
        src="/netflix-logo.png" 
        alt="Netflix Logo" 
        className="netflix-logo" 
        onClick={() => navigate("/")} 
      />
      <div className="header-buttons">
        <button className="sign-in-button"
          onClick={handleSignInClick}>
          Sign In
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;