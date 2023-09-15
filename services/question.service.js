const QUESTION_SCHEMA = require("../schemas/question.schema");

const getAll = async () => {
  return await QUESTION_SCHEMA.find().lean().exec();
};

const create = async (payload) => {
  const { question } = payload;

  const isExist = await QUESTION_SCHEMA.findOne({ question }).lean().exec();

  if (isExist)
    return { status_code: 409, message: "Question is Already Exist." };

  return await QUESTION_SCHEMA.create(payload);
};

module.exports = {
  getAll,
  create,
};
