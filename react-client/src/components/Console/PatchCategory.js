import React, { useState, useEffect } from "react";
import { fetchCategories, patchCategory } from "../../services/api";

const PatchCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [promoted, setPromoted] = useState("no");
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

  // Handle category selection
  const handleCategorySelect = (id) => {
    const category = categories.find((cat) => cat.id === id);
    setSelectedCategory(id);
    setCategoryName(category.name);
    setPromoted(category.promoted ? "yes" : "no");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const updatedCategory = {
      name: categoryName,
      promoted: promoted === "yes",
    };

    try {
      await patchCategory(selectedCategory, updatedCategory, token);
      setMessage("Category updated successfully!");

      // Refresh categories after update
      const updatedCategories = await fetchCategories(token);
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to update category:", error);
      setMessage(`Error updating category: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Update Category</h3>
      {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}

      <div>
        <label htmlFor="categorySelect">Select a category:</label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => handleCategorySelect(e.target.value)}
        >
          <option value="">-- Select a category --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div>
            <label htmlFor="categoryName">Name:</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
          <button type="submit">Update Category</button>
        </form>
      )}
    </div>
  );
};

export default PatchCategory;
