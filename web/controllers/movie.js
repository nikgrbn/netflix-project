const mongoose = require('mongoose');
const userServices = require('../services/user');
const movieService = require('../services/movie');
const errors = require('../utils/errors');
const Category = require('../models/category');

const createMovie = async (req, res) => {
    const { name, category, duration, image, ageLimit, description } = req.body;

    if (!name || !category) {
        return res.status(400).json({ error: 'Name and category are required' });
    }

    try {
        const movie = await movieService.createMovie(name, category, duration, image, ageLimit, description);
        res.status(201).json(movie);
    } catch (error) {
        console.error(`Error creating movie: ${error.message}`);
        if (error.message === 'Category not found') {
            return res.status(400).json({ error: 'Category not found' }); 
        }
        res.status(500).send('An error occurred while creating the movie.');
    }
};

const getMovies = async (req, res) => {
    try {
        const movies = await movieService.getMovies();
        
        const formattedMovies = movies.map(movie => ({
            id: movie._id.toString(), 
            name: movie.name,
            category: movie.category
        }));

        res.status(200).json(formattedMovies); 
    } catch (error) {
        console.error(`Error fetching movies: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const getMovieById = async (req, res) => {
    // Extract movie id from request parameters
    const { id } = req.params;

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    // Call the getMovieById function from movieServices
    try {
        const movie = await movieService.getMovieById(req.params.id);
        if (movie) {
            const formattedMovie = {
                id: movie._id.toString(),
                name: movie.name,
                category: movie.category,
                duration: movie.duration,
                image: movie.image,
                ageLimit: movie.ageLimit,
                description: movie.description,
                watchedBy: movie.watchedBy
            };
            res.status(200).json(formattedMovie);
        } else {
            res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
        }
    }
    
    const updateMovie = async (req, res) => {
        const { id } = req.params; // מזהה הסרט מה-URL
        const updates = req.body; // השדות לעדכון
    
        // בדיקת תקינות של מזהה הסרט
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid movie ID." });
        }
    
        // הסר את האפשרות לשנות את ה-ID
        if (updates._id || updates.id) {
            return res.status(400).json({ error: "Movie ID cannot be modified." });
        }
    
        // בדיקת שדות חובה
        if (!updates.name || !updates.category) {
            return res.status(400).json({ error: "Name and category are required fields." });
        }
    
        try {
            // קריאה לשירות לעדכון הסרט
            const movie = await movieService.updateMovie(id, updates);
            if (!movie) {
                return res.status(404).json({ error: "Movie not found." });
            }
    
            res.status(200).json({ message: "Movie updated successfully.", movie });
        } catch (error) {
            console.error("Error updating movie:", error.message);
            res.status(400).json({ error: error.message });
        }
    };
            
    
    
    
    
    const deleteMovie = async (req, res) => {
        const { id } = req.params; 
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
        }
    
        try {
           
            const movie = await movieService.deleteMovie(id);
            if (!movie) {
                return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
            }
    
            await mongoose.model('User').updateMany(
                {}, 
                { $pull: { watched_movies: id } } 
            );
    
            res.status(204).send(); 
        } catch (error) {
            console.error("Error deleting movie:", error.message);
            res.status(500).json({ error: "An error occurred while deleting the movie." });
        }
    };

module.exports = { createMovie, getMovies, getMovieById, updateMovie, deleteMovie };

