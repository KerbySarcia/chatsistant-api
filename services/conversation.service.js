const CONVERSATION_SCHEMA = require("../schemas/converstation.schema");

const getConversation = async (option) => {
  return await CONVERSATION_SCHEMA.findOne(option).lean().exec();
};

const appendConversation = async (payload) => {
  const { userId, messages } = payload;

  const { conversation_history } = await getConversation({
    userId,
  });

  const newConversation = [...conversation_history, ...messages];

  const updatedConversation = await CONVERSATION_SCHEMA.findOneAndUpdate(
    { userId },
    { conversation_history: newConversation },
    { new: true }
  )
    .lean()
    .exec();
  return updatedConversation;
};

const createConversation = async (userId) => {
  const newConversation = await CONVERSATION_SCHEMA.create({ userId });
  return newConversation;
};

module.exports = {
  getConversation,
  appendConversation,
  createConversation,
};
