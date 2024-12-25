const User = require('../models/user');

const createUser = async (username, password) => {
    const user = new User({ username, password });
    return await user.save();
}

module.exports = { createUser };