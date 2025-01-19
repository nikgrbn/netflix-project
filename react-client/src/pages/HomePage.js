import React, { useEffect, useState } from "react";
import "./HomePage.css";
import {
  fetchMovieVideoStream,
  fetchMovieDetails,
  getUserProfile,
} from "../services/api";
import HomeHeader from "../components/Home/HomeHeader";
import HomeBanner from "../components/Home/HomeBanner";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);

  // Retrieve data from localStorage
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username");
  const display_name = localStorage.getItem("display_name");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("authToken");

  // Redirect to sign-in if token is missing
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieId = 25; // Example movie ID
        const [videoBlobUrl, movie, user] = await Promise.all([
          fetchMovieVideoStream(movieId, token),
          fetchMovieDetails(movieId, token),
          getUserProfile(userId),
        ]);
        console.log("Profile picture:", user);
        setVideoUrl(videoBlobUrl); // Set Blob URL for the video
        setMovieDetails(movie);
        setUserProfile(user.picture);

      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      }
    };

    if (token) {
      fetchMovieData();
    }
  }, [token]);

  const handlePlay = () => {
    console.log("Play button clicked!");
  };

  const handleMoreInfo = () => {
    console.log("More Info button clicked!");
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.setItem("selectedTheme", "dark");
    navigate("/");
  };

  return (
    <div className="home-page">
      <HomeHeader
        username={display_name}
        profilePicture={"default-picture.png"}
      />

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

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
