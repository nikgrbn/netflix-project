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

  // useEffect(() => {
  //   if (is_admin !== "true") {
  //     navigate("/");
  //   }
  // }, [is_admin, navigate]);

  return (
    <div className="console-page">
      <div className="console-section">
        <PostCategory />
      </div>
      <div className="console-section">
        <PatchCategory />
      </div>
      <div className="console-section">
        <DeleteCategory />
      </div>
      <div className="console-section">
        <PostMovie />
      </div>
      <div className="console-section">
        <PutMovie />
      </div>
      <div className="console-section">
        <DeleteMovie />
      </div>
    </div>
  );
};

export default ConsolePage;