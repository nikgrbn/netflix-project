import React from "react";

const SignInButton = ({ onClick }) => {
  return (
    <button type="submit" onClick={onClick}>
      Sign In
    </button>
  );
};

export default SignInButton;
