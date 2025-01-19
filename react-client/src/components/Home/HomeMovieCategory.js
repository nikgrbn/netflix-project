import React, { useRef } from "react";

const HomeMovieCategory = ({ title, movies }) => {
  const movieListRef = useRef(null);

  // Function to handle dragging
  const handleDrag = (event) => {
    const slider = movieListRef.current;
    slider.scrollLeft -= event.movementX;
  };

  // Function to enable drag only when the mouse is down
  const handleMouseDown = (event) => {
    const slider = movieListRef.current;
    slider.isDragging = true;
    slider.classList.add("dragging");
  };

  const handleMouseUp = (event) => {
    const slider = movieListRef.current;
    slider.isDragging = false;
    slider.classList.remove("dragging");
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
            <div key={movie.id} className="movie-item">
              <img src={movie.image} alt={movie.name} draggable="false" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeMovieCategory;
