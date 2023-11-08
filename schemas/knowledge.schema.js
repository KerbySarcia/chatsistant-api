const mongoose = require("mongoose");

const KNOWLEDGE_SCHEMA = mongoose.Schema(
  {
    subject: { type: String, required: true },
    target: { type: String, required: true },
    information: { type: String, required: true },
    // knowledge_embedding: { type: Array },
    value: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Knowledge", KNOWLEDGE_SCHEMA);
