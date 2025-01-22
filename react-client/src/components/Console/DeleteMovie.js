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
    <div className="console-section">
      <h3>Delete Movie</h3>
      <form onSubmit={handleDelete}>
        <div>
          <label htmlFor="movieId">Movie ID:</label>
          <input
            type="text"
            id="movieId"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            placeholder="Enter movie ID"
            required
          />
        </div>
        <button type="submit">Delete Movie</button>
      </form>
      {message && (
        <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
  
};

export default DeleteMovie;