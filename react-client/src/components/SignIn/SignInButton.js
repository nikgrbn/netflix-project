import React from "react";

const SignInButton = ({ onClick }) => {
  return (
    <button type="submit" className="signin-button" onClick={onClick}>
      Sign In
    </button>
  );
};

export default SignInButton;
