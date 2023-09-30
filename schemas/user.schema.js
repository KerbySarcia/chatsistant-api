const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, requried: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
