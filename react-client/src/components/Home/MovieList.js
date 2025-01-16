import React from 'react';

const movies = [
  { id: 1, title: 'Inception', year: 2010 },
  { id: 2, title: 'Interstellar', year: 2014 },
  { id: 3, title: 'The Dark Knight', year: 2008 },
  { id: 4, title: 'The Matrix', year: 1999 },
  { id: 5, title: 'Pulp Fiction', year: 1994 }
];

const MovieList = () => {
  return (
    <div>
      <h2>Movie List</h2>
      <ul>
        {movies.map(movie => (
          <li>
            <h3>{movie.title}</h3>
            <p>Year: {movie.year}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;