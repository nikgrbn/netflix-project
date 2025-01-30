import React from "react";

const SignUpButton = ({ text, type = "submit" }) => {
  return (
    <button type={type}>
      {text}
    </button>
  );
};


export default SignUpButton;
