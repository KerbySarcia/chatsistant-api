const USER_SCHEMA = require("../schemas/user.schema");
const { hashPassword } = require("../utils/password");

const create = async (validatedUserCredentials) => {
  const duplicate = await USER_SCHEMA.findOne({
    username: validatedUserCredentials.username,
  })
    .lean()
    .exec();

  if (duplicate) return { status: 409, data: "duplicate found." };

  const password = await hashPassword(validatedUserCredentials.password);

  const payload = {
    ...validatedUserCredentials,
    password,
  };

  const newUser = await USER_SCHEMA.create(payload);

  return { status: 200, data: newUser };
};

module.exports = {
  create,
};
