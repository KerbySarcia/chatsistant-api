const USER_SCHEMA = require("../schemas/user.schema");
const conversationService = require("../services/conversation.service");
const { hashPassword } = require("../utils/password");
const emailConstants = require("../common/constants/email-constants");

const { createTransport } = require("nodemailer");
const openaiService = require("./openai.service");

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "chatsistant@gmail.com",
    pass: process.env.GMAIL_KEY,
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

  const name =
    validatedUserCredentials.first_name +
    " " +
    validatedUserCredentials.last_name;

  const greetings = [
    `Hello, ${name}! What can I do for you?`,
    `Hi there, ${name}! How may I assist you today?`,
    `Greetings, ${name}! How can I help you?`,
    `Hey, ${name}! What brings you here?`,
    `Hello and welcome, ${name}! What can I assist you with?`,
    `Hi, ${name}! How can I be of service today?`,
    `Greetings, ${name}! What can I help you with right now?`,
    `Hey there, ${name}! How may I assist you?`,
    `Hello, ${name}! What can I do to make your day better?`,
    `Hi, ${name}! How can I support you at the moment?`,
  ];

  const greeting = {
    message: greetings[Math.floor(Math.random() * greetings.length)],
    role: "assistant",
  };

  const addGreetings = await conversationService.updateConversation(
    newUser._id,
    { conversation_history: [greeting] }
  );

  return { status: 200, data: newUser };
};

const sendEmail = async (credentials) => {
  // const answer = await openaiService.emailCompletion(credentials.answer);

  if (credentials?.emailVerify) {
    await transporter.sendMail({
      from: "chatsistant@gmail.com",
      to: credentials.to,
      subject: "Admission",
      html: emailConstants.emailVerification(credentials.to, credentials.code),
    });
  } else if (credentials?.forgotPassword) {
    const findEmail = await USER_SCHEMA.findOne({ email: credentials.to })
      .lean()
      .exec();
    if (!findEmail) return { error: { message: "User does not exist" } };

    await transporter.sendMail({
      from: "chatsistant@gmail.com",
      to: credentials.to,
      subject: "Admission",
      html: emailConstants.forgotPasswordVerification(
        credentials.to,
        credentials.code
      ),
    });
  } else {
    await transporter.sendMail({
      from: "chatsistant@gmail.com",
      to: credentials.to,
      subject: "Admission",
      html: emailConstants.emailInquiry(
        credentials.to,
        credentials.question,
        credentials.answer
      ),
    });
  }
};

const findUser = async (option) => {
  return await USER_SCHEMA.findOne(option);
};

const getUsers = async () => {
  return await USER_SCHEMA.find()
    .select({ password: 0 })
    .sort({ _id: -1 })
    .lean()
    .exec();
};

const deleteUser = async (id) => {
  return await USER_SCHEMA.findOneAndDelete({ _id: id }).lean().exec();
};

const updateUser = async (id, credentials) => {
  let user = null;
  if (credentials?.password) {
    const password = await hashPassword(credentials.password);
    user = await USER_SCHEMA.findOneAndUpdate(
      { _id: id },
      { ...credentials, password: password },
      {
        new: true,
        projection: { password: 0 },
      }
    )
      .lean()
      .exec();
  } else {
    user = await USER_SCHEMA.findOneAndUpdate({ _id: id }, credentials, {
      new: true,
      projection: { password: 0 },
    })
      .lean()
      .exec();
  }

  return user;
};

module.exports = {
  create,
  sendEmail,
  findUser,
  getUsers,
  deleteUser,
  updateUser,
};
