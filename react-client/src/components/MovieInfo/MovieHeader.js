import React from "react";

const MovieHeader = () => {
  return (
    <div className="movie-header">
      <h1 className="movie-title">LOVE IS BLIND UK</h1>
      <div className="movie-details">
        <span className="detail-item">2024</span>
        <span className="detail-item">13+</span>
      </div>
      <p className="movie-description">
        In a small, forgotten town, a young musician discovers a mysterious melody hidden within an old piano. As she unravels its secrets, she is drawn into a haunting tale of love, loss, and redemption that spans generations.
      </p>
      <p className="movie-description">
        <strong>Categories:</strong> Romantic, Comedy
      </p>
    </div>
  );
};

export default MovieHeader;
