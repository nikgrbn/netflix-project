const userServices = require('../services/user');
const errors = require('../utils/errors');

const signUpUser = async (req, res) => {
    // Extract username and password from request body
    const { username, password, picture, watched_movies } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: errors.USERNAME_PASSWORD_REQUIRED });
    }

    // Call the createUser function from userServices
    try {
        const user = await userServices.createUser(username, password, picture, watched_movies);
        if (!user) { return res.status(400).json({ error: errors.USER_NOT_CREATED }); }
        
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password; // Remove password from returned user object
        res.status(201).json(userWithoutPassword);

    } catch (error) {
        if (error.code === 11000) {
            // Duplicate username error
            res.status(400).json({ error: errors.USERNAME_ALREADY_EXISTS });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}

const getUserById = async (req, res) => {
    // Extract user id from request parameters
    const { id } = req.params;

    // Call the getUserById function from userServices
    try {
        const user = await userServices.getUserById(id);
        if (user) {
            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password; // Remove password from returned user object
            res.status(200).json(userWithoutPassword);

        } else {
            res.status(404).json({ error: errors.USER_NOT_FOUND });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { signUpUser, getUserById };