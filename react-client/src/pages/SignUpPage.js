import React from 'react';
import SignUpForm from '../components/SignUp/SignUpForm';
import Header from '../components/Shared/Header';
import "./SignUpPage.css";

const SignUpPage = () => {
  const handleFormSubmit = (data) => {
    console.log("Form Submitted:", data); //TODO: Add API call or navigation logic here

  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <div className="logo">NETFLIX</div>
      </header>
      <div className="signup-content">
        <SignUpForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default SignUpPage;