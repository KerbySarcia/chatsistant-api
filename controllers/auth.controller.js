const { isEmpty, pick } = require("lodash");
const USER_SCHEMA = require("../schemas/user.schema");
const authValidator = require("../validator/auth.validator");
const { comparePassword } = require("../utils/password");
const auth = require("../utils/auth");

const login = async (req, res) => {
  const { error, value } = authValidator.loginValidator.validate(req.body);

  if (!isEmpty(error)) return res.status(400).json(error.message);

  const user = await USER_SCHEMA.findOne({
    email: value.email,
  }).exec();

  if (!user) return res.status(404).json("user does not exist.");

  const isEqual = await comparePassword(value.password, user.password);

  if (!isEqual) return res.status(400).json("password is not equal.");

  const userObject = {
    id: user._id,
  };

  const userDetails = pick(user, ["_id", "first_name", "last_name"]);

  const authToken = auth.signIn(userObject);

  return res.json({ user: userDetails, authToken });
};

module.exports = {
  login,
};
