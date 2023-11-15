const joi = require("joi");

const createKnowledgeValidator = joi.object({
  subject: joi.string().required(),
  target: joi.string().required(),
  value: joi.string().required(),
});

const updateKnowledgeValidator = joi.object({
  id: joi.string().hex().length(24).required(),
  target: joi.string().optional(),
  subject: joi.string().optional(),
  value: joi.string().optional(),
});

const deleteKnowledgeValidator = joi.object({
  id: joi.string().hex().length(24).required(),
});

module.exports = {
  createKnowledgeValidator,
  updateKnowledgeValidator,
  deleteKnowledgeValidator,
};
