const { isEmpty } = require("lodash");
const INQUIRIES_SCHEMA = require("../schemas/inquiries.schema");
const knowledgeService = require("../services/knowledge.service");

const create = async (payload) => {
  const { user_email, date = "", question, user_name } = payload;

  const newInquiry = await INQUIRIES_SCHEMA.create({
    user_email,
    date,
    question,
    user_name,
  });

  return newInquiry;
};

const getAll = async (payload) => {
  let options = {};

  if (payload?.options && payload?.search) {
    options = { [payload.options]: { $regex: payload.search } };
  }

  const results = await INQUIRIES_SCHEMA.find(options).lean().exec();

  return {
    items: results,
  };
};

const updateStatus = async (credentials) => {
  const inquiry = await INQUIRIES_SCHEMA.findOneAndUpdate(
    { _id: credentials._id },
    { status: credentials.status, answer: credentials.answer },
    {
      new: true,
    }
  )
    .lean()
    .exec();

  return inquiry;
};

module.exports = {
  create,
  getAll,
  updateStatus,
};
