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

module.exports = { createUser, getUserById };