const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    default: 1,
  },
  rating: {
    type: String,
    default: "Very Bad",
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

const ratingsDB = mongoose.model("rating", ratingSchema);

module.exports = ratingsDB;
