const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Category = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    promoted: {
        type: Boolean,
        default: false
    }
}, { 
    versionKey: false,
    toJSON: { virtuals: true, transform: (doc, ret) => { delete ret._id; } },
    toObject: { virtuals: true, transform: (doc, ret) => { delete ret._id; } }
});

// Create a virtual field 'id' that returns the value of '_id'
Category.virtual('id').get(function() {
    return this._id;
});

module.exports = mongoose.model('Category', Category);