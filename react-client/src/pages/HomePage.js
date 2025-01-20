import React, { useEffect, useState } from "react";
import "./HomePage.css";
import {
  fetchMovieVideoStream,
  fetchMovieDetails,
  getUserProfile,
  fetchMoviesByUserID,
} from "../services/api";
import HomeHeader from "../components/Home/HomeHeader";
import HomeBanner from "../components/Home/HomeBanner";
import HomeMovieCategory from "../components/Home/HomeMovieCategory";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [categories, setCategories] = useState([]);

  // Retrieve data from localStorage
  const userId = localStorage.getItem("id");
  const display_name = localStorage.getItem("display_name");
  const token = localStorage.getItem("authToken");

  // Redirect to sign-in if token is missing
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  // Fetch user profile and movie data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [user, categories] = await Promise.all([
          getUserProfile(userId),
          fetchMoviesByUserID(userId, token),
        ]);
        console.log("Profile picture:", user.picture);
        setUserProfile(user.picture);
        console.log("Categories details:", categories);
        setCategories(categories);

      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      }
    };

    if (token) {
      fetchHomeData();
    }
  }, [token]);

  // Fetch banner movie data
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        // Ensure categories is defined and has at least one item with movies
        if (categories && categories.length > 0 && categories[0].movies && categories[0].movies.length > 0) {
          
          // Get a random movie from a random category
          const randomCategoryIndex = Math.floor(Math.random() * categories.length);
          const randomMovieIndex = Math.floor(Math.random() * categories[randomCategoryIndex].movies.length);
          const movieId = categories[randomCategoryIndex].movies[randomMovieIndex].id;

          const [videoBlobUrl, movie] = await Promise.all([
            fetchMovieVideoStream(movieId, token),
            fetchMovieDetails(movieId, token),
          ]);
          
          // Set Blob URL and movie details
          setVideoUrl(videoBlobUrl); // Set Blob URL for the video
          setMovieDetails(movie);
          console.log("Banner movie details:", movie);

        } else {
          console.warn("Categories or movies data is not available.");
        }
      } catch (error) {
        console.error("Failed to fetch banner movie data:", error);
      }
    };

    if (categories) {
      fetchBannerData();
    }
  }, [categories]);

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

  const goToMovieInfo = () => {
    const movieId = 25; // Example movie ID, replace with dynamic ID if needed
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="home-page">
      <HomeHeader
        username={display_name}
        profilePicture={userProfile}
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

      <div className="categories-container">
        {categories.map((category) => (
          <HomeMovieCategory
            key={category.categoryId}
            title={category.categoryName}
            movies={category.movies}
          />
        ))}
      </div>
      <button className="movie-info-button" onClick={goToMovieInfo}>
        Movie Info
      </button>
      <button onClick={handleLogout} style={{ fontSize: '1.5rem', padding: '10px 20px', borderRadius: '5px' }}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
