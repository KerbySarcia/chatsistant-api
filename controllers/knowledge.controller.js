const knowledgeService = require("../services/knowledge.service");

const getKnowledges = async (req, res) => {
  const knowledges = await knowledgeService.getAll();
  return res.json(knowledges);
};

const getKnowledge = async (req, res) => {
  const knowledge = await knowledgeService.findSimilarKnowledges(req.body);
  return res.json(knowledge);
};

const createKnowledge = async (req, res) => {
  const createdKnowledge = await knowledgeService.create(req.body);
  return res.json(createdKnowledge);
};

module.exports = {
  getKnowledges,
  createKnowledge,
  getKnowledge,
};
