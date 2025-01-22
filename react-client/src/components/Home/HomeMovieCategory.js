import React, { useRef } from "react";
import { useNavigate,  useLocation } from "react-router-dom";

const HomeMovieCategory = ({ title, movies }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const movieListRef = useRef(null);
  const isDragging = useRef(false);

  // Function to handle dragging
  const handleDrag = (event) => {
    const slider = movieListRef.current;
    slider.scrollLeft -= event.movementX;
    isDragging.current = true; // Set dragging to true when moving
  };

  // Function to enable drag only when the mouse is down
  const handleMouseDown = () => {
    isDragging.current = false; // Reset dragging on mouse down
    const slider = movieListRef.current;
    slider.isDragging = true;
    slider.classList.add("dragging");
  };

  const handleMouseUp = () => {
    const slider = movieListRef.current;
    slider.isDragging = false;
    slider.classList.remove("dragging");
    setTimeout(() => {
      isDragging.current = false; // Ensure drag state resets
    }, 50);
  };

  const handleMovieClick = (movie) => {
    if (!isDragging.current) {
      console.log("Movie clicked:", movie);
      navigate(`/movies/${movie.id}`, {state: { backgroundLocation: location }});
      }
  };

  const handlePlayClick = (movie) => {
    if (movie.id) {
      navigate(`/watch/${movie.id}`);
    } else {
      console.error("Movie is not available.");
    }
  };

  return (
    <div className="movie-category">
      <h2>{title}</h2>
      <div
        className="movie-list"
        ref={movieListRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={(e) => {
          if (movieListRef.current.isDragging) {
            handleDrag(e);
          }
        }}
      >
        <div className="movie-list-content">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-item"
              onClick={() => handleMovieClick(movie)}
            >
              <img src={movie.image} alt={movie.name} draggable="false" />
              
              <button
                className="movie-play-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering other clicks
                  handlePlayClick(movie);
                }}
              >
                <i className="fas fa-play"></i>
              </button>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeMovieCategory;
