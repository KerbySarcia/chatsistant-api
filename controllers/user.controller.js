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

const getUsers = async (req, res) => {
  const users = await userService.getUsers();
  return res.json(users);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const deletedUser = await userService.deleteUser(id);
  return res.json(deletedUser);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await userService.updateUser(id, req.body);
  return res.json(user);
};

module.exports = {
  registerUser,
  getCurrentUser,
  sendEmail,
  getUsers,
  deleteUser,
  updateUser,
};
