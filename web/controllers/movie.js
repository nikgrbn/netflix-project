const mongoose = require('mongoose');
const userServices = require('../services/user');
const movieService = require('../services/movie');
const errors = require('../utils/errors');

const createMovie = async (req, res) => {
    const { name, category } = req.body;

    // Validate required fields
    if (!name || !category) {
        return res.status(400).json({ error: 'Name and category are required' });
    }

    try {
        const movie = await movieService.createMovie(name, category);
        res.status(201).json(movie);
    } catch (error) {
        console.error(`Error creating movie: ${error.message}`);
        if (error.message === 'Invalid category ID') {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        res.status(500).send('An error occurred while creating the movie.');
    }
};

const getMovies = async (req, res) => {
    const userId = req.params.id;


    try {
        res.json(await movieService.getMovies());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

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
            res.status(200).json(movie);
        } else {
            res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
        }
    }
    
    const updateMovie = async (req, res) => {
        const { id } = req.params;
    
        // Check if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
        }
    
        const { name, category } = req.body;
    
        try {
            const movie = await movieService.updateMovie(id, name, category);
            if (movie) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    const deleteMovie = async (req, res) => {
        const { id } = req.params;
    
        // Check if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
        }
    
        try {
            const movie = await movieService.deleteMovie(id);
            if (category) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
            }
        } catch (error) {
    }
}

module.exports = { createMovie, getMovies, getMovieById, updateMovie, deleteMovie };

