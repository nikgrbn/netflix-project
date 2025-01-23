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
    <div className="section-card">
      <h3 className="section-title">Post Movie</h3>
      <form onSubmit={handleSubmit} className="form-container">
        <div>
          <label htmlFor="name" className="label-text">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter movie name"
            required
          />
        </div>
        <div>
          <label htmlFor="categories" className="label-text">Categories (Comma Separated IDs):</label>
          <input
            type="text"
            name="categories"
            id="categories"
            value={formData.categories}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. 1,2,3"
          />
        </div>
        <div>
          <label htmlFor="duration" className="label-text">Duration (minutes):</label>
          <input
            type="number"
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter duration in minutes"
          />
        </div>
        <div>
          <label htmlFor="image" className="label-text">Image:</label>
          <div className="file-wrapper">
            <label htmlFor="image" className="file-label">Choose Image</label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleChange}
              className="file-input"
              accept="image/*"
            />
          </div>
        </div>
        <div>
          <label htmlFor="video" className="label-text">Video:</label>
          <div className="file-wrapper">
            <label htmlFor="video" className="file-label">Choose Video</label>
            <input
              type="file"
              name="video"
              id="video"
              onChange={handleChange}
              className="file-input"
              accept="video/*"
            />
          </div>
        </div>
        <div>
          <label htmlFor="age_limit" className="label-text">Age Limit:</label>
          <input
            type="number"
            name="age_limit"
            id="age_limit"
            value={formData.age_limit}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter age limit"
          />
        </div>
        <div>
          <label htmlFor="description" className="label-text">Description:</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field text-area"
            placeholder="Enter movie description"
          />
        </div>
        <button type="submit" className="action-button">Submit</button>
      </form>
      {message && (
        <p className={`message-paragraph ${message.includes("Failed") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
  
};

export default PostMovie;

