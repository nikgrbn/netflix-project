const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Movie = new Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    categories: {
      type: [{ type: Number, ref: "Category" }],
      default: [],
    },
    duration: {
      type: Number,
      default: 120,
    },
    image: {
      type: String,
      default: 'uploads/movies/default-picture.jpg',
    },
    video: {
      type: String,
      default: 'uploads/movies/default-video.mp4',
    },
    age_limit: {
      type: Number,
      default: 13,
    },
    description: {
      type: String,
      default: "No description available for this movie.",
    },
  }, { 
    versionKey: false,
    toJSON: { virtuals: true, transform: (doc, ret) => { delete ret._id; } },
    toObject: { virtuals: true, transform: (doc, ret) => { delete ret._id; } }
});

// Create a virtual field 'id' that returns the value of '_id'
Movie.virtual('id').get(function() {
    return this._id;
});

module.exports = mongoose.model("Movie", Movie);
