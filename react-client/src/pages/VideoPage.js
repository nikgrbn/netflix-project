import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { fetchMovieVideoStream, fetchMovieDetails } from "../services/api";
import "./VideoPage.css";

const VideoPage = () => {
  const { id } = useParams(); // Retrieve the movie ID from the URL
  const [videoUrl, setVideoUrl] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const navigate = useNavigate(); // Hook to navigate back

  // Retrieve data from localStorage
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [videoBlobUrl, movie] = await Promise.all([
          fetchMovieVideoStream(id, token),
          fetchMovieDetails(id, token),
        ]);

        setVideoUrl(videoBlobUrl);
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
      {videoUrl && (
        <video src={videoUrl} controls autoPlay className="video-player" />
      )}
    </div>
  );
};

export default VideoPage;
