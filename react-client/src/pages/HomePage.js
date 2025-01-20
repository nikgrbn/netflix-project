
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

  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false); // Tracks when data is ready
  const [userProfile, setUserProfile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [categories, setCategories] = useState([]);

  // Retrieve data from localStorage
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [user, fetchedCategories] = await Promise.all([
          getUserProfile(userId),
          fetchMoviesByUserID(userId, token),
        ]);

        setUserProfile(user.picture);
        setCategories(fetchedCategories);

        // Check if categories have movies for the banner
        if (fetchedCategories.length > 0 && fetchedCategories[0].movies?.length > 0) {
          const randomCategoryIndex = Math.floor(Math.random() * fetchedCategories.length);
          const randomMovieIndex = Math.floor(
            Math.random() * fetchedCategories[randomCategoryIndex].movies.length
          );
          const movieId = fetchedCategories[randomCategoryIndex].movies[randomMovieIndex].id;

          const [videoBlobUrl, movie] = await Promise.all([
            fetchMovieVideoStream(movieId, token),
            fetchMovieDetails(movieId, token),
          ]);

          setVideoUrl(videoBlobUrl);
          setMovieDetails(movie);
        }

        setDataReady(true); // Data is ready
      } catch (error) {
        console.error("Failed to fetch home data:", error);
        setDataReady(true); // Mark as ready even if fetching fails
      }
    };

    if (token) {
      fetchHomeData();
    }
  }, [token]);

  // Wait for rendering to complete after data is ready
  useEffect(() => {
    if (dataReady) {
      const timeout = setTimeout(() => setLoading(false), 100); // Add a small delay for smoother transitions
      return () => clearTimeout(timeout);
    }
  }, [dataReady]);

  const handlePlay = () => {
    console.log("Play button clicked!");
  };

  const handleMoreInfo = () => {
    if (movieDetails && movieDetails.id) {
      navigate(`/movies/${movieDetails.id}`);
    } else {
      console.error("Movie ID is not available.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.setItem("selectedTheme", "dark");
    navigate("/");
  };

return (
    <div className="home-page">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* <HomeHeader username={display_name} profilePicture={userProfile} /> */}

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
          <button className="movie-info-button" onClick={handleMoreInfo}>
            Movie Info
          </button>
          <button onClick={handleLogout} style={{ fontSize: '1.5rem', padding: '10px 20px', borderRadius: '5px' }}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default HomePage;