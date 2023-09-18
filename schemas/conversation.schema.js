const mongoose = require("mongoose");

const CONVERSATION_SCHEMA = mongoose.Schema(
  {
    messages: { type: [String] }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", CONVERSATION_SCHEMA);
