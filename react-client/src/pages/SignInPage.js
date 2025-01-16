import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SignInPage.css";

const SignInPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(location.state?.username || "");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div className="signin-page">
      <header className="signin-header">
        <div className="logo">NETFLIX</div>
      </header>
      <div className="signin-content">
        <form className="signin-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="signin-button">
            Sign In
          </button>
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
      </div>
    </div>
  );
};

export default SignInPage;
