const userServices = require('../services/user');

const userSignUp = async (req, res) => {
    // Extract username and password from request body
    const { username, password, picture } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Call the createUser function from userServices
    try {
        const user = await userServices.createUser(username, password, picture);
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password; // Remove password from user object
        res.status(201).json(userWithoutPassword);

    } catch (error) {
        if (error.code === 11000) {
            // Duplicate username error
            res.status(400).json({ error: 'Username already exists' });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = { userSignUp };