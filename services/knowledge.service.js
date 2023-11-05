const { isEmpty } = require("lodash");
const KNOWLEDGE_SCHEMA = require("../schemas/knowledge.schema");
const getEmbedding = require("../utils/getEmbedding");
const { textCompletion } = require("./openai.service");

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

const findSimilarKnowledges = async (payload) => {
  const embedding = await getEmbedding(payload.question);

  const similarDocuments = await KNOWLEDGE_SCHEMA.aggregate([
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

  const answer = await textCompletion(similarDocuments, payload.question);
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
