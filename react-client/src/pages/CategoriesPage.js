import React, { useState, useEffect } from 'react';
import "./CategoriesPage.css";
import {
    fetchCategories
} from "../services/api";


const CategoryPage = () => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                // Fetch categories from the API
                //const categories = await fetchCategories();
                setCategories(categories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        loadCategories();
    }, []);

    return (
        <div className='categories-page'>
            <h1>Category Page</h1>
            <p>Welcome to the Category Page!</p>
        </div>
    );
};

export default CategoryPage;