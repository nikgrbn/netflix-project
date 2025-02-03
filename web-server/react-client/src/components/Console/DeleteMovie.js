import React, { useState } from "react";
import { deleteMovie } from "../../services/api";

const DeleteMovie = () => {
  const [movieId, setMovieId] = useState("");
  const [message, setMessage] = useState("");

  // Handle movie deletion
  const handleDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!movieId.trim()) {
      setMessage("Please enter a valid movie ID.");
      return;
    }

    try {
      await deleteMovie(movieId, token);
      setMessage(`Movie with ID ${movieId} deleted successfully`);
      setMovieId(""); // Clear the input field
    } catch (error) {
      console.error("Failed to delete movie:", error);
      setMessage(`Error deleting movie: ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="section-card">
      <h3 className="section-title">Delete Movie</h3>
      <form className="form-container" onSubmit={handleDelete}>
        <div>
          <label className="label-text" htmlFor="movieId">Movie ID:</label>
          <input
            className="input-field"
            type="text"
            id="movieId"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            placeholder="Enter movie ID"
            required
          />
        </div>
        <button className="action-button" type="submit">Delete Movie</button>
      </form>
      {message && (
        <p className={`message-paragraph ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );

  
};

export default DeleteMovie;