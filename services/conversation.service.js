const CONVERSATION_SCHEMA = require("../schemas/conversation.schema");
const chatService = require("./chat.service");

const get = async (id) => {
  const conversation = await CONVERSATION_SCHEMA.findById(id);
  return conversation;
};

const create = async (payload) => {
  const { question } = payload;
  
  const response = await chatService.query(question);

  const conversation = await CONVERSATION_SCHEMA.create({
    messages: [question, response]
  });

  return {conversation_id: conversation._id, content: {
    question, response
  }};
};

const append = async (id, payload) => {
  const { question } = payload;
  const history = await get(id);

  const response = await chatService.query(question, history.messages);

  await CONVERSATION_SCHEMA.findByIdAndUpdate(id, {
    $push: { messages: { $each: [question, response] }},
  });

  return {conversation_id: id, content: {
    question, response
  }};
};


module.exports = {
  get,
  create,
  append,
};
