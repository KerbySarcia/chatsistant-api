const USER_SCHEMA = require("../schemas/user.schema");
const conversationService = require("../services/conversation.service");
const { hashPassword } = require("../utils/password");

const { createTransport } = require("nodemailer");

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "chatsistant@gmail.com",
    pass: "gion mvcp bscs nzot",
  },
});

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

const sendEmail = async (credentials) => {
  await transporter.sendMail({
    from: "chatsistant@gmail.com",
    to: credentials.to,
    subject: "Admission",
    html: `<h1>Hello this is admission DHVSU</h1>
    <h2>Your Question: ${credentials.question}</h2>
    <h2>Answer: ${credentials.answer}</h2>`,
  });
};

const findUser = async (option) => {
  return await USER_SCHEMA.findOne(option);
};

module.exports = {
  create,
  sendEmail,
  findUser,
};
