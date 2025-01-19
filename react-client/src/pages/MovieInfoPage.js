import React from "react";
import "./MovieInfoPage.css";
import MovieHeader from "../components/MovieInfo/MovieHeader";
import MovieActions from "../components/MovieInfo/MovieActions";

const MovieInfoPage = () => {
  return (
    <div className="movie-info-page">
      {/* Background image */}
      <div className="movie-background"></div>
      
      {/* Transparent overlay */}
      <div className="movie-overlay"></div>
      
      {/* Content */}
      <div className="movie-content">
        <MovieHeader />
        <MovieActions />
      </div>
    </div>
  );
};

export default MovieInfoPage;
