const { isEmpty } = require("lodash");
const KNOWLEDGE_SCHEMA = require("../schemas/knowledge.schema");
const getEmbedding = require("../utils/getEmbedding");
const { textCompletion, validateQuestion } = require("./openai.service");
const inquiryService = require("../services/inquires.service");
const conversationService = require("../services/conversation.service");

const getAll = async (payload) => {
  const page = parseInt(payload.page || 1);
  const limit = parseInt(payload?.limit || 10);
  const skip = parseInt(page === 1 ? 0 : (page - 1) * limit);
  let options = {};

  if (payload?.options && payload?.search) {
    options = { [payload.options]: { $regex: payload.search } };
  }

  const results = await KNOWLEDGE_SCHEMA.find(options)
    .select({ information_embedding: false })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
  const totalCount = isEmpty(results)
    ? 0
    : await KNOWLEDGE_SCHEMA.count(payload.options);
  const totalPages = Math.ceil(totalCount / payload.limit);
  const hasNext = isEmpty(results) ? false : page !== totalPages;
  const hasPrevious = isEmpty(results) ? false : page !== 1;

  return {
    items: results,
    hasNext,
    hasPrevious,
    totalCount,
    totalPages,
    currentPage: page,
  };
};

const create = async (payload) => {
  const { information } = payload;

  const isExist = await KNOWLEDGE_SCHEMA.findOne({ information }).lean().exec();

  if (isExist)
    return { status_code: 409, message: "Information is Already Exist." };

  return await KNOWLEDGE_SCHEMA.create(payload);
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
        value: 1,
        score: { $meta: "searchScore" },
      },
    },
  ]);

  const conversations = await conversationService.getConversation({
    // _id: user?._id.toString().replace(/ObjectId\("(.*)"\)/, "$1"),
    userId: user?._id,
  });

  const answer = await textCompletion(
    similarDocuments,
    payload?.question,
    conversations.conversation_history
  );
  return answer;
};

const updateKnowledge = async (id, knowledge) => {
  const updatedKnowledge = await KNOWLEDGE_SCHEMA.findOneAndUpdate(
    { _id: id },
    knowledge,
    { new: true }
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

module.exports = {
  getAll,
  create,
  findSimilarKnowledges,
  updateKnowledge,
  deleteKnowledge,
};
