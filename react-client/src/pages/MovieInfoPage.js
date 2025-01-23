import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieInfoPage.css";
import MovieHeader from "../components/MovieInfo/MovieHeader";
import MovieActions from "../components/MovieInfo/MovieActions";
import HomeMovieCategory from "../components/Home/HomeMovieCategory";
import { fetchMovieDetails, fetchRecommendedMovies } from "../services/api";
import VideoPlayer from "../components/Shared/VideoPlayer";

const MovieInfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [error, setError] = useState(null);
  const modalRef = useRef(null); // Ref for the modal content
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        const [movieData] = await Promise.all([fetchMovieDetails(id, token)]);
        setMovieDetails(movieData);
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

  // Add a click listener to close modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!movieDetails) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        ref={modalRef} // Attach ref to modal content
        style={{ width: "60%", maxWidth: "1200px", height: "80%" }}
      >
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>
        <div className="modal-header" style={{ height: "60%" }}>
          <VideoPlayer movieId={id} token={token} />
        </div>
        <div className="modal-body" style={{ height: "40%" }}>
          <MovieHeader movieDetails={movieDetails} />
          <div className="movie-actions">
            <MovieActions movieId={movieDetails.id} />
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
