import React, { useState } from "react";
import SignUpInput from "./SignUpInput";
import SignUpButton from "./SignUpButton";

const SignUpForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    display_name: "",
    picture: null,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null); // For image preview

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, picture: file }));
    setPreview(file ? URL.createObjectURL(file) : null); // Generate preview
  };

  const validateField = (field, value) => {
    let error = "";

    if (field === "username" && !value.trim()) {
      error = "Please enter a valid username.";
    }

    if (field === "password" && (value.length < 4 || value.length > 60)) {
      error = "Password must have 4-60 characters.";
    }

    if (field === "confirmPassword" && value !== formData.password) {
      error = "Passwords do not match!";
    }

    if (field === "display_name" && !value.trim()) {
      error = "Display name cannot be empty.";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    validateField(field, formData[field]);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value); // Real-time validation
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    ["username", "password", "confirmPassword", "display_name"].forEach((field) =>
      validateField(field, formData[field])
    );

    // Check for any validation errors
    if (Object.values(errors).some((error) => error)) {
      return;
    }

    onSubmit(formData); // Submit validated data
  };

  return (
    <form className="form-group" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>

      <div>
        <SignUpInput
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(value) => handleChange("username", value)}
          onBlur={() => handleBlur("username")}
          className={errors.username ? "has-error error" : ""}
          autoComplete="off"
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
      </div>

      <div>
        <SignUpInput
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(value) => handleChange("password", value)}
          onBlur={() => handleBlur("password")}
          className={errors.password ? "has-error error" : ""}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>

      <div>
        <SignUpInput
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(value) => handleChange("confirmPassword", value)}
          onBlur={() => handleBlur("confirmPassword")}
          className={errors.confirmPassword ? "has-error error" : ""}
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <SignUpInput
          type="text"
          placeholder="Display Name"
          value={formData.display_name}
          onChange={(value) => handleChange("display_name", value)}
          onBlur={() => handleBlur("display_name")}
          className={errors.display_name ? "has-error error" : ""}
        />
        {errors.display_name && (
          <p className="error-message">{errors.display_name}</p>
        )}
      </div>

      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            style={{ width: "100px", height: "100px", marginTop: "10px" }}
          />
        )}
      </div>

      <SignUpButton
        text="Sign Up"
        className={`signup-button ${
          Object.keys(errors).length > 0 ? "error" : ""
        }`}
      />
    </form>
  );
};

export default SignUpForm;
