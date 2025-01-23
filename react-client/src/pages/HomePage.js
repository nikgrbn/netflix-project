import React, { useEffect, useState } from "react";
import "./HomePage.css";
import {
  fetchMovieDetails,
  fetchMoviesByUserID,
} from "../services/api";
import HomeBanner from "../components/Home/HomeBanner";
import HomeMovieCategory from "../components/Home/HomeMovieCategory";
import { useNavigate, useLocation } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false); // Tracks when data is ready
  const [bannerMovieId, setBannerMovieId] = useState(null);
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
          setBannerMovieId(movieId);
        }

        setDataReady(true); // Data is ready
      } catch (error) {
        console.error("Failed to fetch home data:", error);
        fetchHomeData(); // Retry fetching data
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

  return (
    <div className="home-page">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
            <HomeBanner
            bannerMovieId={bannerMovieId}
            />

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
