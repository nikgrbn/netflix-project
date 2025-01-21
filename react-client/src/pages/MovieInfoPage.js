import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieInfoPage.css";
import MovieHeader from "../components/MovieInfo/MovieHeader";
import MovieActions from "../components/MovieInfo/MovieActions";
import { fetchMovieDetails, fetchMovieVideoStream } from "../services/api";

const MovieInfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        const [movieData, videoStreamUrl] = await Promise.all([
          fetchMovieDetails(id, token),
          fetchMovieVideoStream(id, token),
        ]);
        setMovieDetails(movieData);
        setVideoUrl(videoStreamUrl);
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

  const closeModal = () => {
    navigate(-1); // חזרה לעמוד הקודם
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!movieDetails || !videoUrl) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '60%', maxWidth: '1200px', height: '80%' }}>
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>
        <div className="modal-header" style={{ height: '60%' }}>
          <video
            className="movie-background"
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
          ></video>
        </div>
        <div className="modal-body" style={{ height: '40%' }}>
          <MovieHeader movieDetails={movieDetails} />
          <MovieActions />
        </div>
      </div>
    </div>
  );
};

export default MovieInfoPage;
