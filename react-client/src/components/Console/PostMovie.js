import React, { useState } from "react";
import { postMovie } from "../../services/api";

const PostMovie = () => {
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    categories: "",
    duration: 120,
    image: null,
    video: null,
    age_limit: 13,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const preparedFormData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "name" || (value && value !== "")) {
          if (key === "categories") {
            value
              .split(",")
              .map((id) => id.trim())
              .forEach((category, index) =>
                preparedFormData.append(`categories[${index}]`, category)
              );
          } else {
            preparedFormData.append(key, value);
          }
        }
      });

      const response = await postMovie(preparedFormData, token);
      setMessage("Movie posted successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unknown error occurred.";
      setMessage(`Failed to post movie: ${errorMessage}`);
    }
  };

  return (
    <div className="console-section">
      <h3>Post Movie</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="categories">Categories (Comma Separated IDs):</label>
          <input
            type="text"
            name="categories"
            id="categories"
            value={formData.categories}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="duration">Duration (minutes):</label>
          <input
            type="number"
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <div className="input-file-wrapper">
            <label className="input-file-label" htmlFor="image">Choose Image</label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="video">Video:</label>
          <div className="input-file-wrapper">
            <label className="input-file-label" htmlFor="video">Choose Video</label>
            <input
              type="file"
              name="video"
              id="video"
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="age_limit">Age Limit:</label>
          <input
            type="number"
            name="age_limit"
            id="age_limit"
            value={formData.age_limit}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && (
        <p className={`message ${message.includes("Failed") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default PostMovie;

