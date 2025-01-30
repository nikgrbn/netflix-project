import React, { useState, useEffect } from 'react';
import { PostCategory } from "../../services/api";

const CategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [promoted, setPromoted] = useState("no");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const categoryData = {
      name: categoryName,
      promoted: promoted === "yes",
    };
  
    try {
      const result = await PostCategory(categoryData, token);
      console.log("API call successful:", result);
      setMessage("Category posted successfully");
    } catch (error) {
      console.error("Error occurred:", error);
      setMessage(`Failed to post category: ${JSON.stringify(error)}`);
    }
  };
  
  return (
    <div className="section-card">
      <h3 className="section-title">Post Category</h3>
      <form className="form-container" onSubmit={handleSubmit}>
        <div>
          <label className="label-text" htmlFor="categoryName">Category Name:</label>
          <input
            className="input-field"
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
        <div>
          <label className="label-text" htmlFor="promoted">Promoted:</label>
          <select
            className="input-field"
            id="promoted"
            value={promoted}
            onChange={(e) => setPromoted(e.target.value)}
            required
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <button className="action-button" type="submit">Create Category</button>
      </form>
      {message && (
        <p className={`message-paragraph ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );

};


export default CategoryForm;
