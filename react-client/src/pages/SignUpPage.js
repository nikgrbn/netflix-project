import React from "react";
import SignUpForm from "../components/SignUp/SignUpForm";
import "./SignUpPage.css"; // Ensure this import is correct
import { signUpUser } from "../services/api"; // Import API service
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

        <div className="signup-footer">
          <Link to="/signin" className="signup-footer-link">
            <span className="white-text">Already have an account?</span>{" "}
            <span className="blue-text">Sign in</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;
