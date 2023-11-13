const moongose = require("mongoose");

const NUMBEROFINQUIRIES_SCHEMA = moongose.Schema(
  {
    message: { type: String },
    user_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = moongose.model("NumberReceived", NUMBEROFINQUIRIES_SCHEMA);
