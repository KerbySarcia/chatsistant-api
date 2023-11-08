const INQUIRIES_SCHEMA = require("../schemas/inquiries.schema");

const create = async (payload) => {
  const { user_email, date = "monday", question } = payload;

  const newInquiry = await INQUIRIES_SCHEMA.create({
    user_email,
    date,
    question,
  });

  return newInquiry;
};

module.exports = {
  create,
};
