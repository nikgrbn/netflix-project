import React, { useState } from "react";
import { patchCategory } from "../../services/api";

const PatchCategory = () => {
  const [categoryIdToEdit, setCategoryIdToEdit] = useState(""); // שדה ה-ID של הקטגוריה
  const [newCategoryName, setNewCategoryName] = useState("");
  const [promoted, setPromoted] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!categoryIdToEdit.trim()) {
      setMessage("Please enter the category ID to edit.");
      return;
    }

    // Build the updatedCategory object dynamically
    const updatedCategory = {};
    if (newCategoryName.trim()) {
      updatedCategory.name = newCategoryName;
    }
    if (promoted) {
      updatedCategory.promoted = promoted;
    }

    try {
      await patchCategory(categoryIdToEdit, updatedCategory, token); 
      setMessage(`Category with ID "${categoryIdToEdit}" updated successfully!`);
    } catch (error) {
      console.error("Failed to update category:", error);
      setMessage(`Error updating category: ${JSON.stringify(error)}`);
    }
  };

  return (
    <div>
      <h3>Patch Category</h3>
      {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="categoryIdToEdit">Category ID to Edit:</label>
          <input
            type="text"
            id="categoryIdToEdit"
            value={categoryIdToEdit}
            onChange={(e) => setCategoryIdToEdit(e.target.value)}
            placeholder="Enter the category ID to edit"
            required
          />
        </div>
        <div>
          <label htmlFor="newCategoryName">New Name:</label>
          <input
            type="text"
            id="newCategoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter new category name (optional)"
          />
        </div>
        <div>
          <label htmlFor="promoted">Promoted:</label>
          <select
            id="promoted"
            value={promoted}
            onChange={(e) => setPromoted(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <button type="submit">Update Category</button>
      </form>
    </div>
  );
};

export default PatchCategory;
