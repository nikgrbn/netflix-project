import React, { useState } from "react";
import SignUpInput from "./SignUpInput";
import SignUpButton from "./SignUpButton";

const SignUpForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [errors, setErrors] = useState({}); // Tracks field-specific errors
  const [touched, setTouched] = useState({}); // Tracks which fields have been focused

  const handleImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const validateField = (field, value) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (field === "username" && value.trim() === "") {
        if (!prevErrors.username)
          newErrors.username = "Please enter a valid username.";
      } else {
        delete newErrors.username;
      }

      if (field === "password") {
        if (!value || value.length < 4 || value.length > 60) {
          if (!prevErrors.password)
            newErrors.password = "Password must have 4-60 characters.";
        } else {
          delete newErrors.password;
        }
      }

      if (field === "confirmPassword" && value !== password) {
        if (!prevErrors.confirmPassword)
          newErrors.confirmPassword = "Passwords do not match!";
      } else {
        delete newErrors.confirmPassword;
      }

      if (field === "displayName" && value.trim() === "") {
        if (!prevErrors.displayName)
          newErrors.displayName = "Display name cannot be empty.";
      } else {
        delete newErrors.displayName;
      }

      return newErrors;
    });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, eval(field)); // Dynamically validate the field
  };

  const handleFocus = (field) => {
    // Clear the error for the field when focused
    setErrors((prevErrors) => {
      const { [field]: _, ...rest } = prevErrors; // Remove the specific error
      return rest;
    });

    // Mark the field as touched
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));
  };

  const handleChange = (field, value) => {
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);
    if (field === "displayName") setDisplayName(value);

    // Clear errors as the user types
    validateField(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate all fields explicitly
    if (!username.trim()) {
      newErrors.username = "Please enter a valid username.";
    }
    if (!password || password.length < 4 || password.length > 60) {
      newErrors.password = "Password must have 4-60 characters.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    if (!displayName.trim()) {
      newErrors.displayName = "Display name cannot be empty.";
    }

    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
      return;
    }

    // Clear errors and submit the form
    setErrors({});
    onSubmit({ username, password, displayName, profileImage });
  };

  return (
    <form className="form-group" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>

      <div>
        <SignUpInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(value) => handleChange("username", value)}
          onBlur={() => handleBlur("username")}
          onFocus={() => handleFocus("username")}
          hasError={!!errors.username}
          autocomplete="off" // Add this line
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
      </div>

      <div>
        <SignUpInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(value) => handleChange("password", value)}
          onBlur={() => handleBlur("password")}
          onFocus={() => handleFocus("password")}
          hasError={!!errors.password}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>

      <div>
        <SignUpInput
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(value) => handleChange("confirmPassword", value)}
          onBlur={() => handleBlur("confirmPassword")}
          onFocus={() => handleFocus("confirmPassword")}
          hasError={!!errors.confirmPassword}
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
      </div>

      <div>
        <SignUpInput
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(value) => handleChange("displayName", value)}
          onBlur={() => handleBlur("displayName")}
          onFocus={() => handleFocus("displayName")}
          hasError={!!errors.displayName}
        />
        {errors.displayName && <p className="error-message">{errors.displayName}</p>}
      </div>

      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <SignUpButton text="Sign Up" />
    </form>
  );
};

export default SignUpForm;
