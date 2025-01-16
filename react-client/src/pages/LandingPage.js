import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = ({}) => {
    const [username, setUsername] = useState("");
    
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/signin', { state: { username }});
    };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="logo">NETFLIX</div>
        <div className="header-buttons">
          <select className="language-select">
            <option value="en">English</option>
            <option value="he">עברית</option>
          </select>
          <button className="sign-in-button">Sign In</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="landing-content">
        <h1>Unlimited movies, TV<br />shows, and more</h1>
        <p>Starts at ₪32.90. Cancel anytime.</p>
        <p>Ready to watch? Enter your username to create or restart your membership..</p>
        <form className="landing-form" onSubmit={handleSubmit}>
          <input
            className="username-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="get-started-button" type="submit">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
