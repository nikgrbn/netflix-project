import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignInButton from "./SignInButton";

const SignInForm = ({ onSubmit }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(location.state?.username || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (field === "username" && value.trim() === "") {
        newErrors.username = "Username cannot be empty.";
      } else {
        delete newErrors.username;
      }

      if (field === "password" && (value.trim().length < 4 || value.trim().length > 60)) {
        newErrors.password = "Password must be between 4 and 60 characters.";
      } else {
        delete newErrors.password;
      }

      return newErrors;
    });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, eval(field)); // Evaluate the current field value
  };

  const handleFocus = (field) => {
    setErrors((prevErrors) => {
      const { [field]: _, ...rest } = prevErrors; // Remove the specific error
      return rest;
    });

    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));
  };

  const handleChange = (field, value) => {
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);

    validateField(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username cannot be empty.";
    }
    if (password.length < 4 || password.length > 60) {
      newErrors.password = "Password must be between 4 and 60 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ username, password });
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <form className="form-group" onSubmit={handleSubmit}>
      <h1>Sign In</h1>

      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => handleChange("username", e.target.value)}
          onBlur={() => handleBlur("username")}
          onFocus={() => handleFocus("username")}
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          onFocus={() => handleFocus("password")}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>

      <SignInButton />
      <div>
        <p>
          New to Netflix?{" "}
          <button type="button" className="signup-button" onClick={handleSignUpClick}>
            Sign up now
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignInForm;