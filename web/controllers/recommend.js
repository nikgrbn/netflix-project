const userServices = require('../services/user');
const mongoose = require('mongoose');
const errors = require('../utils/errors');
const { MRSClient, codes } = require('../clients/MRSClient');


const addUserWatchedMovie = async (req, res) => {
    // Check if the movie id is a valid MongoDB ObjectId
    const movieId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
    }

    // Retrieve user from MongoDB
    const userId = req.userId;
    try {
        const user = await userServices.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }

        // Check if the movie is already in the watched_movies list
        if (user.watched_movies.includes(movieId)) {
            return res.status(204).send();
        }

        // Add movie to the watched_movies list
        await userServices.addUserWatchedMovie(userId, movieId);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    // Update MRS server
    const client = new MRSClient();
    try {
        // Connect to the MRS server
        await client.connect();

        // Send the first message
        const postMessage = `POST ${userId} ${movieId}`;
        const postResponse = await client.sendMessage(postMessage);

        // If POST is successful, disconnect and return
        if (postResponse.trim() === codes.CREATED) {
            await client.disconnect();
            return res.status(204).send();
        }

        // If POST fails, try PATCH
        const patchMessage = `PATCH ${userId} ${movieId}`;
        const patchResponse = await client.sendMessage(patchMessage);

        // If PATCH is successful, disconnect and return
        if (patchResponse.trim() === codes.NO_CONTENT) {
            await client.disconnect();
            return res.status(204).send();
        }

        // If PATCH fails, rollback MongoDB update
        await client.disconnect();
        await userServices.removeUserWatchedMovie(userId, movieId);
        return res.status(400).json({ error: patchResponse.trim() });

    } catch (error) {
        // Rollback MongoDB update if MRS server update fails
        await client.disconnect();
        await userServices.removeUserWatchedMovie(userId, movieId);
        return res.status(400).json({ error: error });
    }
}

module.exports = { addUserWatchedMovie };