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
  const page = parseInt(payload.page || 1);
  const limit = parseInt(payload?.limit || 10);
  const skip = parseInt(page === 1 ? 0 : (page - 1) * limit);
  let options = {};

  if (payload?.options && payload?.search) {
    options = { [payload.options]: { $regex: payload.search } };
  }

  const results = await INQUIRIES_SCHEMA.find(options)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
  const totalCount = isEmpty(results)
    ? 0
    : await INQUIRIES_SCHEMA.count(payload.options);
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
