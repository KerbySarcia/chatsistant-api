const KNOWLEDGE_SCHEMA = require("../schemas/knowledge.schema");
const getEmbedding = require("../utils/getEmbedding");
const { textCompletion } = require("./openai.service");

const getAll = async () => {
  return await KNOWLEDGE_SCHEMA.find().lean().exec();
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

module.exports = {
  getAll,
  create,
  findSimilarKnowledges,
};
