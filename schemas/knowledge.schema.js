const mongoose = require("mongoose");

const KNOWLEDGE_SCHEMA = mongoose.Schema(
  {
    identifier: { type: String, required: true },
    tag: { type: String, required: true },
    information: { type: String, required: true },
    information_embedding: { type: Array },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Knowledge", KNOWLEDGE_SCHEMA);
