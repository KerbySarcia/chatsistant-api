const USER_SCHEMA = require("../schemas/user.schema");
const conversationService = require("../services/conversation.service");
const { hashPassword } = require("../utils/password");

const create = async (validatedUserCredentials) => {
  const duplicate = await USER_SCHEMA.findOne({
    email: validatedUserCredentials.email,
  })
    .lean()
    .exec();

  if (duplicate) return { status: 409, data: "Email is already used" };

  const password = await hashPassword(validatedUserCredentials.password);

  const payload = {
    ...validatedUserCredentials,
    password,
  };

  const newUser = await USER_SCHEMA.create(payload);

  const newConversation = await conversationService.createConversation(
    newUser._id
  );

  return { status: 200, data: newUser };
};

const findUser = async (option) => {
  return await USER_SCHEMA.findOne(option);
};

module.exports = {
  create,
  findUser,
};
