import React from "react";

const HomeMovieCategory = ({ title, movies }) => {
  return (
    <div className="movie-category">
      <h2>{title}</h2>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img src={movie.image} alt={movie.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeMovieCategory;
