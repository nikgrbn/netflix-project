import React, { useEffect, useState } from "react";
import "./HomePage.css";
import {
  fetchMovieVideoStream,
  fetchMovieDetails,
  fetchMoviesByUserID,
} from "../services/api";
import HomeBanner from "../components/Home/HomeBanner";
import HomeMovieCategory from "../components/Home/HomeMovieCategory";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false); // Tracks when data is ready
  const [videoUrl, setVideoUrl] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [categories, setCategories] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Open and close handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
        const [fetchedCategories] = await Promise.all([
          fetchMoviesByUserID(userId, token),
        ]);
        setCategories(fetchedCategories);

        // Check if categories have movies for the banner
        if (
          fetchedCategories.length > 0 &&
          fetchedCategories[0].movies?.length > 0
        ) {
          const randomCategoryIndex = Math.floor(
            Math.random() * fetchedCategories.length
          );
          const randomMovieIndex = Math.floor(
            Math.random() * fetchedCategories[randomCategoryIndex].movies.length
          );
          const movieId =
            fetchedCategories[randomCategoryIndex].movies[randomMovieIndex].id;

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
    if (movieDetails.id) {
      navigate(`/watch/${movieDetails.id}`);
    } else {
      console.error("Movie is not available.");
    }
  };

  const handleMoreInfo = () => {
    if (movieDetails && movieDetails.id) {
      navigate(`/movies/${movieDetails.id}`);
    } else {
      console.error("Movie ID is not available.");
    }
  };

  return (
    <div className="home-page">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default HomePage;
