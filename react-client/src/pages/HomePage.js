import React from 'react';
import MovieList from '../components/Home/MovieList';
import Header from '../components/Shared/Header';

const HomePage = () => {
  return (
    <div className="home">
      <Header />
      <h1>Home</h1>
      <MovieList />
    </div>
  );
}

export default HomePage;