import React from "react";
import LandingHeader from "../components/LandPage/LandingHeader";
import LandingContent from "../components/LandPage/LandingContent";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  localStorage.setItem("selectedTheme", "dark");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div>
      <LandingHeader />
      <div className="landing-page">
        <LandingContent />
      </div>
    </div>
  );
};

export default LandingPage;
