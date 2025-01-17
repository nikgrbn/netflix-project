import React from "react";
import { useNavigate } from "react-router-dom";

const SignUpButton = ({ text, type = "button" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <button className="signup-button" onClick={handleClick} type={type}>
      {text}
    </button>
  );
};

export default SignUpButton;
