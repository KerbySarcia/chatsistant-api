const userService = require("../services/user.service");
const { isEmpty } = require("lodash");
const { userRegistrationValidator } = require("../validator/user.validator");

const registerUser = async (req, res) => {
  const { error, value } = userRegistrationValidator.validate(req.body);

  if (!isEmpty(error)) return res.status(400).json(error.message);

  const registeredUser = await userService.create(value);

  return res.status(registeredUser.status).json(registeredUser.data);
};

module.exports = {
  registerUser,
};
