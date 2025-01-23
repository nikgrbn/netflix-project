import React, { useState } from "react";
import { deleteCategory } from "../../services/api";

const DeleteCategory = () => {
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");

  // Handle category deletion
  const handleDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!categoryId.trim()) {
      setMessage("Please enter a valid category ID.");
      return;
    }

    try {
      await deleteCategory(categoryId, token);
      setMessage(`Category with ID ${categoryId} deleted successfully`);
      setCategoryId(""); // Clear the input field
    } catch (error) {
      console.error("Failed to delete category:", error);
      setMessage(`Error deleting category: ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="section-card">
      <h3 className="section-title">Delete Category</h3>
      <form className="form-container" onSubmit={handleDelete}>
        <div>
          <label className="label-text" htmlFor="categoryId">Category ID:</label>
          <input
            className="input-field"
            type="text"
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="Enter category ID"
            required
          />
        </div>
        <button className="action-button" type="submit">Delete Category</button>
      </form>
      {message && (
        <p className={`message-paragraph ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );

  
};

export default DeleteCategory;