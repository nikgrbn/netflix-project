const userServices = require('../services/user');
const movieServices = require('../services/movie'); // Import movie services
const { formatMongoDocument } = require("../utils/helpers");
const { errors }  = require('../utils/consts');
const { MRSClient, codes } = require('../clients/MRSClient');

const getRecommendations = async (req, res) => {
    // Check if the movie id is a valid MongoDB ObjectId
    const movieId = req.params.id;
    try {
        const movie = await movieServices.getMovieById(movieId);
        if (!movie) {
            return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    
    // Retrieve user from MongoDB
    const userId = req.userId;
    try {
        const user = await userServices.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: errors.USER_NOT_FOUND });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    // Connect to the MRS server
    const client = new MRSClient();
    try {
        await client.connect();

        // Send GET request to the MRS server
        const message = `GET ${userId} ${movieId}`;
        const response = await client.sendMessage(message);

        // Disconnect from the MRS server
        await client.disconnect();

        // Parse the response and return recommendations
        const responseParts = response.trim().split('\n\n');
        if (responseParts[0] !== codes.OK) {
            return res.status(400).json({ error: errors.BAD_REQUEST });
        }
        
        // Extract movie ids from the response
        const movieIds = responseParts.slice(1).map(id => id.trim().split(' ')).flat();
        
        // Get movie details for each recommended movie
        const movies = []
        for (const id of movieIds) {
            const movie = await movieServices.getMovieById(id);
            if (!movie) {
                return res.status(404).json({ error: errors.MOVIE_NOT_FOUND });
            }

            // Format the movie document
            const formattedMovie = formatMongoDocument(movie);

            // Construct the full movie picture URL
            formattedMovie.image = formattedMovie.image
                ? `${req.protocol}://${req.get("host")}/${formattedMovie.image}`
                : `${req.protocol}://${req.get("host")}/uploads/movies/default-picture.jpg`;

            // Remove internal MongoDB fields
            if (formattedMovie.categories) {
                formattedMovie.categories = formattedMovie.categories.map(category => {
                    category.id = category._id;
                    delete category._id;
                    return category;
                });
            }

            movies.push(formattedMovie);
        }

        res.status(200).json(movies);
    } catch (error) {
        await client.disconnect();
        return res.status(400).json({ error: error });
    }
}


const addUserWatchedMovie = async (req, res) => {
    // Check if the movie id is a valid MongoDB ObjectId
    const movieId = req.params.id;

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

module.exports = { addUserWatchedMovie, getRecommendations };