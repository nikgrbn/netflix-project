import React, { useState } from "react";

const VideoPlayer = ({ movieId, controlsMode = false, isMuted = true, className = "" }) => {
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:19844/api";
  const videoUrl = `${API_BASE_URL}/movies/${movieId}/video`;

  const handleCanPlay = (e) => {
    e.target.play();
  };

  const handleVideoError = () => {
    setError("Failed to load the video. Please try again later.");
  };

  return (
    <div className="video-player-container">
      {/* Error message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Video player */}
      <video
        className={`video-player ${className}`}
        controls={controlsMode}
        autoPlay
        playsInline
        preload="auto"
        muted={isMuted}
        onCanPlay={handleCanPlay}
        onError={handleVideoError}
        onPause={handleCanPlay}
        onPlaying={() => console.log("Video is playing")}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
