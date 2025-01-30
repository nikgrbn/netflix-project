import React from "react";
import { useNavigate } from "react-router-dom";

const MovieActions = ({ movieId }) => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate(`/watch/${movieId}`);
  };

  return (
    <div className="action-buttons">
      <button className="play-button-movie" onClick={handlePlayClick}>
        <i className="fas fa-play"></i> Play
      </button>
    </div>
  );
};

export default MovieActions;
