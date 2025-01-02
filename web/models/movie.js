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
    category: {
      type: Number,
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
    age_limit: {
      type: Number,
      default: 13,
    },
    description: {
      type: String,
      default: "No description available for this movie.",
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Build the object with explicit field order
        const formattedDoc = {
          id: ret._id, // Add `id` first
          name: ret.name,
          category: ret.category,
          duration: ret.duration,
          image: ret.image,
          age_limit: ret.age_limit,
          description: ret.description,
        };
        delete ret._id; // Remove `_id`
        return formattedDoc; // Return the reordered object
      },
    },
    versionKey: false, // Remove the __v field
  }
);

module.exports = mongoose.model("Movie", Movie);
