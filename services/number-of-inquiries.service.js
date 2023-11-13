const schema = require("../schemas/number-of-inquiries.schema");

const updateSchema = async (payload) => {
  return await schema.create(payload);
};

const getAll = async () => {
  return await schema.find().lean().exec();
};

module.exports = {
  updateSchema,
  getAll,
};
