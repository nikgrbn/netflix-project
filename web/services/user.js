const User = require('../models/user');

const createUser = async (username, password, picture) => {
    const user = new User({ username, password });

    // If a picture is provided, set it as the user's picture
    if (picture) {
        user.picture = picture
    }

    return await user.save();
}

const getUserById = async (id) => { return await User.findById(id) }

const getUserByCredentials = async (username, password) => {
    // Find the user by username (username is unique therefore only one user will be returned)
    const user = await User.findOne({ username });
    if (!user) {
        return null;
    }

    // Compare the provided password with the stored hashed password
    if (password != user.password) {
        return null;
    }

    return user;
}

module.exports = { createUser, getUserById, getUserByCredentials };