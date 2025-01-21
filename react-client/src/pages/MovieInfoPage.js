import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieInfoPage.css";
import MovieHeader from "../components/MovieInfo/MovieHeader";
import MovieActions from "../components/MovieInfo/MovieActions";
import HomeMovieCategory from "../components/Home/HomeMovieCategory";
import {
  fetchMovieDetails,
  fetchMovieVideoStream,
  fetchRecommendedMovies,
} from "../services/api";

const MovieInfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("id");

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
    const loadRecommendedMovies = async () => {
      try {
        const recommendations = await fetchRecommendedMovies(userId, id, token);
        setRecommendedMovies(recommendations);
      } catch (err) {
        console.error("Error fetching recommended movies:", err);
      }
    };

    if (token) {
      loadMovieData();
      loadRecommendedMovies();
    } else {
      setError("No authentication token found.");
    }
  }, [id, token]);

  const closeModal = () => {
    navigate(-1);
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!movieDetails || !videoUrl) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ width: "60%", maxWidth: "1200px", height: "80%" }}
      >
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>
        <div className="modal-header" style={{ height: "60%" }}>
          <video
            className="movie-background"
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
          ></video>
        </div>
        <div className="modal-body" style={{ height: "40%" }}>
          <MovieHeader movieDetails={movieDetails} />
          <div className="movie-actions">
            <MovieActions />
          </div>
          {recommendedMovies.length > 0 ? (
            <div className="recommendations">
              <HomeMovieCategory
                title="Recommended Movies"
                movies={recommendedMovies}
              />
            </div>
          ) : (
            <div className="no-recommendations">
              <h2>No recommendations available</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MovieInfoPage;
