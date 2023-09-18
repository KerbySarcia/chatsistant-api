const conversationService = require('../services/conversation.service');

const getConversation = async (req, res) => {
  const { id } = req.params;
  const result = await conversationService.get(id);
  return res.json(result);
};

const createConversation = async (req, res) => {
  const createdConversation = await conversationService.create(req.body);
  return res.json(createdConversation);
};

const appedToConversation = async (req, res) => {
  const { id } = req.params;
  const result = await conversationService.append(id, req.body);
  return res.json(result);
};

module.exports = {
  createConversation,
  getConversation,
  appedToConversation,
};