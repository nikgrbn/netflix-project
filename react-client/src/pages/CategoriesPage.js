import React, { useState, useEffect } from 'react';
import "./CategoriesPage.css";
import {
    fetchCategories
} from "../services/api";
import HomeMovieCategory from "../components/Home/HomeMovieCategory";

const CategoryPage = () => {

    const [categories, setCategories] = useState([]);

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                // Fetch categories from the API
                const categories = await fetchCategories(token);
                console.log("Categories:", categories);
                setCategories(categories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        loadCategories();
    }, []);

    return (
        <div className='categories-page'>
          <div className="categories-container">
            {categories.map((category) => (
              <HomeMovieCategory
                key={category.categoryId}
                title={category.categoryName}
                movies={category.movies}
              />
            ))}
          </div>
        </div>
    );
};

export default CategoryPage;