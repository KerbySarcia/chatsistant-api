const KNOWLEDGE_SCHEMA = require("../schemas/knowledge.schema");
const getEmbedding = require("../utils/getEmbedding");
const textRegenerate = require("../utils/textCompletion");
const conversationService = require("../services/conversation.service");

const getAll = async (payload) => {
  let options = {};

  if (payload?.options && payload?.search) {
    options = { [payload.options]: { $regex: payload.search, $options: "i" } };
  }

  const results = await KNOWLEDGE_SCHEMA.find(options)
    .select({ information_embedding: false })
    .sort({ _id: -1 })
    .lean()
    .exec();

  return {
    items: results,
  };
};

const create = async (payload) => {
  const { target, value, subject } = payload;

  const isExist = await KNOWLEDGE_SCHEMA.findOne({
    information: `${target} - ${subject} - ${value}`,
  })
    .lean()
    .exec();

  if (isExist)
    return { status_code: 409, message: "Information is Already Exist." };

  return await KNOWLEDGE_SCHEMA.create({
    target,
    subject,
    value,
    information: `${target} - ${subject} - ${value}`,
  });
};

const findSimilarKnowledges = async (payload, user) => {
  const embedding = await getEmbedding(payload.question);

  let similarDocuments = await KNOWLEDGE_SCHEMA.aggregate([
    {
      $search: {
        index: "default",
        knnBeta: {
          vector: embedding,
          path: "information_embedding",
          k: 5,
        },
      },
    },
    {
      $project: {
        _id: 0,
        information: 1,
        score: { $meta: "searchScore" },
      },
    },
  ]);

  const conversations = await conversationService.getConversation({
    userId: user?._id,
  });

  const answer = await textRegenerate(
    similarDocuments,
    payload?.question,
    conversations.conversation_history,
    {
      user_name: user.first_name + " " + user.last_name,
      user_email: user.email,
      date: user.createdAt,
    }
  );

  return answer;
};

const tryKnowledge = async (payload, conversations) => {
  const embedding = await getEmbedding(payload.question);

  let similarDocuments = await KNOWLEDGE_SCHEMA.aggregate([
    {
      $search: {
        index: "default",
        knnBeta: {
          vector: embedding,
          path: "information_embedding",
          k: 5,
        },
      },
    },
    {
      $project: {
        _id: 0,
        information: 1,
        score: { $meta: "searchScore" },
      },
    },
  ]);

  const answer = await textRegenerate(
    similarDocuments,
    payload?.question,
    conversations
  );

  return answer;
};

const updateKnowledge = async (id, knowledge) => {
  const updatedKnowledge = await KNOWLEDGE_SCHEMA.findOneAndUpdate(
    { _id: id },
    {
      ...knowledge,
      information: `${knowledge.target} - ${knowledge.subject} - ${knowledge.value}`,
    },
    { new: true, projection: { information_embedding: 0 } }
  )
    .lean()
    .exec();

  return updatedKnowledge;
};

const deleteKnowledge = async (id) => {
  const deletedKnowledge = await KNOWLEDGE_SCHEMA.findOneAndDelete({
    _id: id,
  }).exec();
  return deletedKnowledge;
};

const getSubjects = async () => {
  return await KNOWLEDGE_SCHEMA.find({}, { subject: 1 }).lean().exec();
};

const getTargets = async () => {
  return await KNOWLEDGE_SCHEMA.find({}, { target: 1 }).lean().exec();
};

module.exports = {
  getAll,
  create,
  findSimilarKnowledges,
  updateKnowledge,
  deleteKnowledge,
  getSubjects,
  getTargets,
  tryKnowledge,
};
