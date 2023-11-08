const { isEmpty } = require("lodash");
const knowledgeService = require("../services/knowledge.service");
const {
  createKnowledgeValidator,
  updateKnowledgeValidator,
  deleteKnowledgeValidator,
} = require("../validator/knowledge.validator");

const getKnowledges = async (req, res) => {
  const knowledges = await knowledgeService.getAll(req.query);
  return res.json(knowledges);
};

const getKnowledge = async (req, res) => {
  try {
    const knowledge = await knowledgeService.findSimilarKnowledges(
      req.body,
      req?.user?.email
    );
    return res.json(knowledge);
  } catch (error) {
    console.log("getKnowledge error => ", error);
    res.status(400).json(error);
  }
};

const createKnowledge = async (req, res) => {
  const { error, value } = createKnowledgeValidator.validate(req.body);
  if (!isEmpty(error)) return res.status(400).json(error.message);
  const createdKnowledge = await knowledgeService.create(value);
  return res.json(createdKnowledge);
};

const updateKnowledge = async (req, res) => {
  const { knowledge } = req.body;
  const { id } = req.params;

  const { error } = updateKnowledgeValidator.validate({
    id,
    ...knowledge,
  });

  if (!isEmpty(error)) return res.status(400).json(error.message);

  const updatedKnowledge = await knowledgeService.updateKnowledge(
    id,
    knowledge
  );

  return res.json(updatedKnowledge);
};

const deleteKnowledge = async (req, res) => {
  const { id } = req.params;
  const { error } = deleteKnowledgeValidator.validate({ id });
  if (!isEmpty(error)) return res.status(400).json(error.message);
  const deletedKnowledge = await knowledgeService.deleteKnowledge(id);
  return res.json(deletedKnowledge);
};

module.exports = {
  getKnowledges,
  createKnowledge,
  getKnowledge,
  updateKnowledge,
  deleteKnowledge,
};
