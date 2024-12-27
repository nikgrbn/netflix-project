const userServices = require('../services/user');
const mongoose = require('mongoose');
const errors = require('../utils/errors');
const MRSClient = require('../clients/MRSClient');

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
            // Connect to the MRS server
            const client = new MRSClient();
            await client.connect();

            // Send the first message
            const postMessage = `POST ${userId} ${movieId}`;
            const postResponse = await client.sendMessage(postMessage);
            
            // If the response is 201 Created, disconnect
            if (postResponse.trim() === '201 Created') {
                await client.disconnect();
                return res.status(204).send();
            }

            // If couldn't POST, then PATCH existing user
            const patchMessage = `PATCH ${userId} ${movieId}`;
            const patchResponse = await client.sendMessage(patchMessage);

            // Disconnect from the server
            await client.disconnect();
            
            // Send the response to the client
            if (patchResponse.trim() === '204 No Content') {
                res.status(204).send();
            } else {
                res.status(400).json({ error: patchResponse.trim() });
            }
        } else {
            res.status(404).json({ error: errors.USER_NOT_FOUND });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { addUserWatchedMovie };