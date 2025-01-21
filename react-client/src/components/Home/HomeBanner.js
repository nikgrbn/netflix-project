import React from 'react';

const HomeBanner = ({ title, description, videoUrl, onPlay, onMoreInfo }) => {
  return (
    <div className="banner">
      <div className="banner-gradient"></div>
      <video
        className="banner-video"
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
      />
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
