const userServices = require('../services/user');
const { errors }  = require('../utils/consts');

const authenticateUser = async (req, res) => {
    // Extract username and password from request body
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: errors.USERNAME_PASSWORD_REQUIRED });
    }

    // Call the authenticateUser function from userServices
    try {
        const user = await userServices.getUserByCredentials(username, password);
        if (user) {
            // User found and credentials are valid
            res.status(200).json({ id: user._id });

        } else {
            // User not found or invalid credentials
            res.status(404).json({ error: errors.INVALID_CREDENTIALS });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { authenticateUser };