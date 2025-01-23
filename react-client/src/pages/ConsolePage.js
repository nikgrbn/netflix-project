import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConsolePage.css";
import PostCategory from "../components/Console/PostCategory";
import PatchCategory from "../components/Console/PatchCategory";
import DeleteCategory from "../components/Console/DeleteCategory";
import PostMovie from "../components/Console/PostMovie";
import PutMovie from "../components/Console/PutMovie";
import DeleteMovie from "../components/Console/DeleteMovie";

const ConsolePage = () => {
  const navigate = useNavigate();
  const is_admin = localStorage.getItem("is_admin");

  useEffect(() => {
    if (is_admin !== "true") {
      navigate("/");
    }
  }, [is_admin, navigate]);

  return (
    <div className="page-grid">
      <div className="section-card">
        <PostCategory />
      </div>
      <div className="section-card">
        <PatchCategory />
      </div>
      <div className="section-card">
        <DeleteCategory />
      </div>
      <div className="section-card">
        <PostMovie />
      </div>
      <div className="section-card">
        <PutMovie />
      </div>
      <div className="section-card">
        <DeleteMovie />
      </div>
    </div>
  );
};

export default ConsolePage;
