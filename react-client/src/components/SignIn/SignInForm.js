import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SignInButton from "./SignInButton";

const SignInForm = () => {
  const location = useLocation();

  const [username, setUsername] = useState(location.state?.username || "");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { username, password });
  };

  return (
    <form className="form-group" onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <SignInButton />
    </form>
  );
};

export default SignInForm;
