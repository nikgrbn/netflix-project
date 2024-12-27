const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: false,
        default: 'default-picture.jpg'
    },
}, { versionKey: false });
module.exports = mongoose.model('User', User);