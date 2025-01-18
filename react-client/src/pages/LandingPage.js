import React from "react";
import LandingHeader from "../components/LandPage/LandingHeader";
import LandingContent from "../components/LandPage/LandingContent";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <LandingHeader />
      <LandingContent />
    </div>
  );
};

export default LandingPage;
