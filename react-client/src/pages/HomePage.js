import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { fetchMovieVideoUrl, fetchMovieDetails } from '../services/api';
import HomeHeader from "../components/Home/HomeHeader";
import useUserRedirect from "../components/Shared/useUserRedirect";
import HomeBanner from "../components/Home/HomeBanner";


const HomePage = (props) => {
  const isValidUser = useUserRedirect(props.token);

  const [videoUrl, setVideoUrl] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieId = 25; // Example movie ID
        const [videoUrl, movie] = await Promise.all([
          fetchMovieVideoUrl(movieId),
          fetchMovieDetails(movieId),
        ]);
        setVideoUrl(videoUrl);
        setMovieDetails(movie);
      } catch (error) {
        console.error('Failed to fetch movie data:', error);
      }
    };

    fetchMovieData();
  }, []);

  const handlePlay = () => {
    console.log('Play button clicked!');
  };

  const handleMoreInfo = () => {
    console.log('More Info button clicked!');
  };

  if (!isValidUser) {
    return null;
  }

  return (
    <div className="home-page">
      <HomeHeader username="John Doe" profilePicture="default-picture.png" />

      {videoUrl && movieDetails ? (
        <HomeBanner
          title={movieDetails.name}
          description={movieDetails.description}
          videoUrl={videoUrl}
          onPlay={handlePlay}
          onMoreInfo={handleMoreInfo}
        />
      ) : (
        <p>Loading banner...</p>
      )}

      <h1>Home</h1>
    </div>
  );
};

export default HomePage;