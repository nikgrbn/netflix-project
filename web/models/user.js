const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = new Schema({
    _id: {
        type: Number,
        required: true
    },
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
    display_name: {
        type: String,
        required: false,
        default: ''
    },
    is_admin: {
        type: Boolean,
        required: false,
        default: false
    },
    watched_movies: {
        type: [{ type: Number, ref: 'Movie' }],
        required: false,
        default: []
    }
}, { versionKey: false });
module.exports = mongoose.model('User', User);