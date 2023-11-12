const mongoose = require("mongoose");

const INQUIRIES_SCHEMA = mongoose.Schema({
  question: { type: String, required: true },
  user_email: { type: String, required: true },
  date: { type: String, required: true },
  user_name: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING", "IGNORED", "DONE"],
    default: "PENDING",
  },
});

module.exports = mongoose.model("Inquiries", INQUIRIES_SCHEMA);
