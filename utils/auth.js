const jwt = require("jsonwebtoken");
const { get } = require("lodash");
const AUTH_TOKEN = get(process, "env.AUTH_TOKEN_SECRET", "chatsistant");

const signIn = (userCredentials) => {
  return jwt.sign(userCredentials, AUTH_TOKEN, { expiresIn: "10min" });
};

module.exports = {
  signIn,
};
