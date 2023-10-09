const moongose = require("mongoose");

const CONVERSATION_SCHEMA = moongose.Schema({
  userId: { type: String, required: true },
  conversation_history: { type: Array },
});

module.exports = moongose.model("Conversation", CONVERSATION_SCHEMA);
