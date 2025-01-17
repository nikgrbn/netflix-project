import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SignInButton from "./SignInButton"; // ייבוא הכפתור המעוצב


const SignInForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(location.state?.username || "");
  const [password, setPassword] = useState("");

  // פונקציה לטיפול ב-Submit של הטופס
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { username, password });
  };

  // פונקציה למעבר לדף ההרשמה
  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
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
      {/* שימוש בקומפוננטת הכפתור המעוצב */}
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
