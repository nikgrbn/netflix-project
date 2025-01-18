import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { fetchMovieVideoStream, fetchMovieDetails } from '../services/api';
import HomeHeader from "../components/Home/HomeHeader";
import useUserRedirect from "../components/Shared/useUserRedirect";
import HomeBanner from "../components/Home/HomeBanner";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();
  const { username, role, token } = location.state || {};

  // Call the hook with the token
  const isValidUser = useUserRedirect(token);

  const [videoUrl, setVideoUrl] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieId = 25; // Example movie ID
        const [videoBlobUrl, movie] = await Promise.all([
          fetchMovieVideoStream(movieId, token),
          fetchMovieDetails(movieId, token),
        ]);
        console.log("Fetched movie data:", videoBlobUrl);
        setVideoUrl(videoBlobUrl); // Set Blob URL for the video
        setMovieDetails(movie);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
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