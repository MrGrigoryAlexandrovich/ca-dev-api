const mongoose = require("mongoose");

const TechnologiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  page: {
    type: String,
    required: true,
  },
});

const TechnologiesDB = mongoose.model("technologie", TechnologiesSchema);

module.exports = TechnologiesDB;
