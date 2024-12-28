const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Movie = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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
    ageLimit: {
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
