import React, { useState } from "react";
import SignUpInput from "./SignUpInput";
import SignUpButton from "./SignUpButton";

const SignUpForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");

  const handleImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    onSubmit({ username, password, displayName, profileImage });
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      {error && <p className="error-message">{error}</p>}
      <SignUpInput
        type="text"
        placeholder="Username"
        value={username}
        onChange={setUsername}
      />
      <SignUpInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={setPassword}
      />
      <SignUpInput
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />
      <SignUpInput
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={setDisplayName}
      />
      <div className="form-group">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      <SignUpButton text="Sign Up" />
    </form>
  );
};

export default SignUpForm;
