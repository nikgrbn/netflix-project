const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Category = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    promoted: {
        type: Boolean,
        default: false
    }
}, { versionKey: false });
module.exports = mongoose.model('Category', Category);