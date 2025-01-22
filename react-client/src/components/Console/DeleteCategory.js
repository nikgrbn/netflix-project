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
    <div className="container">
      <h3>Delete Category</h3>
      <form onSubmit={handleDelete}>
        <div>
          <label htmlFor="categoryId">Category ID:</label>
          <input
            type="text"
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="Enter category ID"
            required
          />
        </div>
        <button type="submit">Delete Category</button>
      </form>
      {message && (
        <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
  
};

export default DeleteCategory;