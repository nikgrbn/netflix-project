import React from "react";
import { useNavigate } from "react-router-dom";

const LandingHeader = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/signin");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <header className="header-container">
      <img 
        src="/netflix-logo.png?cache-bust=true"
        alt="Netflix Logo" 
        className="netflix-logo" 
        onClick={() => navigate("/")} 
      />
      <div className="header-buttons">
        <button className="sign-in-button"
          onClick={handleSignInClick}>
          Sign In
        </button>
        <button className="sign-in-button"
          onClick={handleSignUpClick}>
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;