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
    <div className="console-section">
      <h3>Post Category</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="categoryName">Category Name:</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
        <div>
          <label htmlFor="promoted">Promoted:</label>
          <select
            id="promoted"
            value={promoted}
            onChange={(e) => setPromoted(e.target.value)}
            required
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <button type="submit">Create Category</button>
      </form>
      {message && (
        <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
};


export default CategoryForm;
