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
    watched_movies: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
        required: false,
        default: []
    }
}, { versionKey: false });
module.exports = mongoose.model('User', User);