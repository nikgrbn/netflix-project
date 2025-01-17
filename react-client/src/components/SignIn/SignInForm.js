import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SignInButton from "./SignInButton"; 
import useTheme from "../Shared/ThemeProvider";



const SignInForm = () => {
const { theme, toggleTheme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(location.state?.username || "");
  const [password, setPassword] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { username, password });
  };


  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
        <button onClick={toggleTheme} className="theme-toggle-button">
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      <h1>Sign In</h1>
      <div className="form-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <SignInButton />
      <div className="signup-section">
        <p>
          New to Netflix?{" "}
          <button
            type="button"
            className="signup-button"
            onClick={handleSignUpClick}
          >
            Sign up now.
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignInForm;
