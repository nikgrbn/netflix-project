import React from "react";

const MovieHeader = ({ movieDetails }) => {
  return (
    <div className="movie-header">
      <h1 className="movie-title">{movieDetails.name}</h1>
      <div className="movie-details">
        <span className="detail-item">
          {movieDetails.age_limit ? `${movieDetails.age_limit}+` : "N/A"}
        </span>
        <span className="detail-item">{movieDetails.duration || "N/A"} min</span>
      </div>
      <p className="movie-description">{movieDetails.description}</p>
      <p className="movie-description">
        <strong>Categories:</strong> {movieDetails.categories.join(", ")}
      </p>
    </div>
  );
};

export default MovieHeader;
