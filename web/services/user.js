const User = require('../models/user');

const createUser = async (username, password, picture) => {
    const user = new User({ username, password });

    // If a picture is provided, set it as the user's picture
    if (picture) {
        user.picture = picture
    }
    
    return await user.save();
}

module.exports = { createUser };