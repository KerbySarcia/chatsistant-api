const userService = require("../services/user.service");
const { isEmpty, get } = require("lodash");
const { userRegistrationValidator } = require("../validator/user.validator");

const registerUser = async (req, res) => {
  const { error, value } = userRegistrationValidator.validate(req.body);

  if (!isEmpty(error)) return res.status(400).json(error.message);

  const registeredUser = await userService.create(value);

  return res.status(registeredUser.status).json(registeredUser.data);
};

const getCurrentUser = async (_, res) => {
  const user = get(res, "locals.currentUser");
  const currentUser = await userService.findUser({ _id: user._id });
  return res.json(currentUser);
};

const sendEmail = async (req, res) => {
  const responseEmail = await userService.sendEmail(req.body);
  res.json(responseEmail);
};

module.exports = {
  registerUser,
  getCurrentUser,
  sendEmail,
};
