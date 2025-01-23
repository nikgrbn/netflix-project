import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingContent = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/signin', { state: { username } });
  };

  return (
    <div className="landing-content">
      <h1>Unlimited movies, TV<br />shows, and more</h1>
      <p2>Starts at ₪32.90. Cancel anytime.</p2>
      <p>Ready to watch? Enter your username to create or restart your membership.</p>
      <form className="landing-form" onSubmit={handleSubmit}>
        <input
          className="username-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="get-started-button" type="submit">
          Get Started <span>&#x27A4;</span>
        </button>
      </form>
    </div>
  );
};

export default LandingContent;
