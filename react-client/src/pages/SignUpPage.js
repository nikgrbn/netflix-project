import React from "react";
import SignUpForm from "../components/SignUp/SignUpForm";
import "./SignUpPage.css"; // Ensure this import is correct

const SignUpPage = () => {
  const handleFormSubmit = (data) => {
    console.log("Form Submitted:", data); //TODO: Add API call or navigation logic here
  };

  return (
    <div className="signup-page">
      <div className="signup-content">
        <SignUpForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default SignUpPage;
