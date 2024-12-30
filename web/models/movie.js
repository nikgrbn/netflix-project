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
      type: [{ type: Number, ref: 'Category' }],
      required: true,
    },

    duration: {
      type: Number,
      default: 120,
    },
    image: {
      type: String,
      default: "https://example.com/default-image.jpg",
    },
    age_limit: {
      type: Number,
      default: 13,
    },
    description: {
      type: String,
      default: "No description available for this movie.",
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Movie", Movie);
