import React, { useState, useEffect } from 'react';
import { fetchCategories, deleteCategory } from "../../services/api";

const DeleteCategory = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const fetchedCategories = await fetchCategories(token);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setMessage(`Error fetching categories: ${error.message}`);
      }
    };

    loadCategories();
  }, []);

  // Handle category deletion
  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      await deleteCategory(id, token);
      setMessage(`Category with ID ${id} deleted successfully`);
      // Fetch updated categories
      const updatedCategories = await fetchCategories(token);
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to delete category:", error);
      setMessage(`Error deleting category: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Delete Category</h3>
      {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Category Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Promoted</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
  {categories.map((category) => (
    <tr key={category.id}>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
        {category.name || "No Name"}
      </td>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
        {category.promoted ? "Yes" : "No"}
      </td>
      <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
        <button
          onClick={() => handleDelete(category.id)}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default DeleteCategory;
