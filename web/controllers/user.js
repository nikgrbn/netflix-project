const userServices = require('../services/user');

const userSignUp = async (req, res) => {
    // Extract username and password from request body
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Call the createUser function from userServices
    try {
        const user = await userServices.createUser(username, password);
        res.status(201).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { userSignUp };