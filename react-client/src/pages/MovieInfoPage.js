import React, { useEffect, useState } from "react";
import "./MovieInfoPage.css";
import MovieHeader from "../components/MovieInfo/MovieHeader";
import MovieActions from "../components/MovieInfo/MovieActions";
import {
  fetchMovieVideoStream,
  fetchMovieDetails,
} from "../services/api";
import { useParams } from "react-router-dom";

const MovieInfoPage = () => {
  const { id } = useParams(); // Get the movie ID from the route parameters
  const [movieDetails, setMovieDetails] = useState(null); // State to store movie details
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null); // State to handle errors
  const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        const [movieData, videoStreamUrl] = await Promise.all([
          fetchMovieDetails(id, token), // Fetch movie details
          fetchMovieVideoStream(id, token), // Fetch video stream
        ]);
        setMovieDetails(movieData);
        setVideoUrl(videoStreamUrl); // Set the video URL
      } catch (err) {
        setError(err);
        console.error("Error fetching movie data:", err);
      }
    };

    if (token) {
      loadMovieData();
    } else {
      setError("No authentication token found.");
    }
  }, [id, token]);

  if (error) {
    return <div className="error">Error: {error}</div>; // Display error message
  }

  if (!movieDetails || !videoUrl) {
    return <div className="loading">Loading...</div>; // Show a loading message until the data is fetched
  }

  return (
    <div className="movie-info-page">
      {/* Background video */}
      <video
        className="movie-background"
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Transparent overlay */}
      <div className="movie-overlay"></div>

      {/* Content */}
      <div className="movie-content">
        <MovieHeader movieDetails={movieDetails} />
        <MovieActions />
      </div>
    </div>
  );
};

export default MovieInfoPage;