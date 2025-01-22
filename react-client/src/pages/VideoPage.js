import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  postWatchedMovie,
  validateToken,
} from "../services/api";
import "./VideoPage.css";
import VideoPlayer from "../components/Shared/VideoPlayer";

const VideoPage = () => {
  const { id } = useParams(); // Retrieve the movie ID from the URL
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate(); // Hook to navigate back

  // Retrieve data from localStorage
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    validate();
  }, [token, navigate]);

  // Validate the token
  const validate = async () => {
    try {
      const response = await validateToken(token);
      console.log("Token validation response:", response);
      if (response.status === 200) {
        setIsTokenValid(true);
      } else {
        throw new Error("Token validation failed");
      }
    } catch (error) {
      console.error("Failed to validate token:", error);
      navigate("/home");
    }
  };

  useEffect(() => {
    if (isTokenValid) {
      fetchMovieData();
    }
  }, [isTokenValid]);

  // Fetch movie data
  const fetchMovieData = async () => {
    try {
      await postWatchedMovie(userId, id, token);
    } catch (error) {
      console.error("Failed to fetch movie data:", error);
    }
  };

  return (
    <div className="video-page">
      {/* Back button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i>
      </button>

      {/* Video player */}
      <div>
        <VideoPlayer
          movieId={id}
          token={token}
          controlsMode={true}
          className="video-player"
        />
      </div>
    </div>
  );
};

export default VideoPage;
