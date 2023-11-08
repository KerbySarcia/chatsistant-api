const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["USER", "ADMIN", "STAFF"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
