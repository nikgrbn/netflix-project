import React from 'react';
import VideoPlayer from '../Shared/VideoPlayer';

const HomeBanner = ({ id, title, description, onPlay, onMoreInfo }) => {
  return (
    <div className="banner">
      <div className="banner-gradient"></div>
      <div>
       <VideoPlayer movieId={id} className='banner-video'/>
      </div>
      <div className="banner-content">
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="banner-buttons">
          <button className="play-button" onClick={onPlay}>
            <i className="fas fa-play"></i> Play
          </button>
          <button className="info-button" onClick={onMoreInfo}>
            <i className="fas fa-info-circle fa-lg"></i> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
