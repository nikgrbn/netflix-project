import React, { useState } from "react";
import { putMovie } from "../../services/api";

const PutMovie = () => {
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    id: null,
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
        if ((key === "name" || (value && value !== "")) && key !== "id") {
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

      const response = await putMovie(formData.id, preparedFormData, token);
      setMessage("Movie put successfully");
    } catch (error) {
      setMessage(`Failed to put movie:  ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="console-section">
      <h3>Put Movie</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            name="id"
            id="id"
            value={formData.id}
            onChange={handleChange}
            required
          />
        </div>
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
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="video">Video:</label>
          <input
            type="file"
            name="video"
            id="video"
            onChange={handleChange}
          />
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

export default PutMovie;
