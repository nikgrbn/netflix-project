const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Movie = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { versionKey: false }
);
module.exports = mongoose.model("Movie", Movie);
