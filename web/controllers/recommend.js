const userServices = require('../services/user');
const mongoose = require('mongoose');
const errors = require('../utils/errors');

const addUserWatchedMovie = async (req, res) => {
    const movieId = req.params.id;

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    const userId = req.userId;
    try {
        const user = await userServices.addUserWatchedMovie(userId, movieId);
        if (user) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: errors.USER_NOT_FOUND });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { addUserWatchedMovie };