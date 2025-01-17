import React from "react";
import SignUpForm from "../components/SignUp/SignUpForm";
import "./SignUpPage.css"; // Ensure this import is correct
import { signUpUser } from '../services/api'; // Import API service
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (data) => {
    try {
      await signUpUser(data);
      alert("User signed up successfully!");
      navigate("/signin");

    } catch (error) {
      console.error("Error signing up", error);
    }
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
