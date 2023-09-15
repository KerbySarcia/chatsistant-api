const mongoose = require("mongoose");

const QUESTION_SCHEMA = mongoose.Schema(
  {
    question: { type: String },
    answer: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", QUESTION_SCHEMA);
