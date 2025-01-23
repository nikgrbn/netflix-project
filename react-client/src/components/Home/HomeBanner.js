import React, { useState, useEffect } from 'react';
import VideoPlayer from '../Shared/VideoPlayer';
import { fetchMovieDetails } from '../../services/api';
import { useNavigate, useLocation } from "react-router-dom";


const HomeBanner = ({bannerMovieId}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [movieDetails, setMovieDetails] = useState(null);
  const [bannerMovieName, setBannerMovieName] = useState(null);
  const [bannerMovieDescription, setBannerMovieDescription] = useState(null);

  // Retrieve data from localStorage
  const token = localStorage.getItem("authToken");
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        
          const movie = await fetchMovieDetails(bannerMovieId, token);
          console.log("Movie details:", movie);
          setMovieDetails(movie);
          setBannerMovieName(movie.name);
          setBannerMovieDescription(movie.description);
        
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
      }
    };

    fetchDetails();
  }, []);

  const handlePlay = () => {
    if (movieDetails.id) {
      navigate(`/watch/${movieDetails.id}`);
    } else {
      console.error("Movie is not available.");
    }
  };

  const handleMoreInfo = () => {
    if (movieDetails && movieDetails.id) {
      navigate(`/movies/${movieDetails.id}`, {state: { backgroundLocation: location }});
    } else {
      console.error("Movie ID is not available.");
    }
  };

  return (
    <div className="banner">
      <div className="banner-gradient"></div>
      <div>
        {/* Render VideoPlayer only when bannerMovieId is valid */}
        {bannerMovieId && <VideoPlayer movieId={bannerMovieId} className="banner-video" />}
      </div>
      <div className="banner-content">
        <h1>{bannerMovieName}</h1>
        <p>{bannerMovieDescription}</p>
        <div className="banner-buttons">
          <button className="play-button" onClick={handlePlay}>
            <i className="fas fa-play"></i> Play
          </button>
          <button className="info-button" onClick={handleMoreInfo}>
            <i className="fas fa-info-circle fa-lg"></i> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
