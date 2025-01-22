import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { fetchMovieDetails } from "../services/api";
import "./VideoPage.css";
import VideoPlayer from "../components/Shared/VideoPlayer";

const VideoPage = () => {
  const { id } = useParams(); // Retrieve the movie ID from the URL
  const [movieDetails, setMovieDetails] = useState(null);
  const navigate = useNavigate(); // Hook to navigate back

  // Retrieve data from localStorage
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movie] = await Promise.all([fetchMovieDetails(id, token)]);

        setMovieDetails(movie);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      }
    };

    if (token) {
      fetchMovieData();
    }
  }, [id, token]);

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
