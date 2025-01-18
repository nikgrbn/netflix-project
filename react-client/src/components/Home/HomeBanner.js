import React from "react";

const HomeBanner = ({ title, description, imageUrl, onPlay, onMoreInfo }) => {
  return (
    <div className="banner">
      <div className="banner-gradient"></div>
      <img src={imageUrl} alt="Banner" className="banner-image" />
      <div className="banner-content">
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="banner-buttons">
          <button className="play-button" onClick={onPlay}>
            <span className="icon-play" /> Play
          </button>
          <button className="info-button" onClick={onMoreInfo}>
            <span className="icon-info" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
