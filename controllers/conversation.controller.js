const conversationService = require("../services/conversation.service");
const knowledgeService = require("../services/knowledge.service");
const inquiryService = require("../services/number-of-inquiries.service");

const createCommunication = async (req, res) => {
  const { message } = req.body;
  const { user } = req;

  const aiResponse = await knowledgeService.findSimilarKnowledges(
    {
      question: message,
    },
    user
  );
  const addQuestion = await inquiryService.updateSchema({
    user_id: user._id,
    message,
  });
  const appendUserMessage = await conversationService.appendConversation({
    userId: user._id,
    messages: [{ message: message, role: "user" }, aiResponse],
  });

  return res.json(aiResponse);
};

const getConversation = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "ID is required" });

  const conversation = await conversationService.getConversation({
    userId: id,
  });

  return res.json(conversation);
};

const updateConversation = async (req, res) => {
  const { id } = req.params;
  const conversation = await conversationService.updateConversation(
    id,
    req.body
  );

  return res.json(conversation);
};

module.exports = {
  createCommunication,
  getConversation,
  updateConversation,
};
