const questionService = require("../services/question.service");

const getQuestions = async (req, res) => {
  const questions = await questionService.getAll();
  return res.json(questions);
};

const createQuestion = async (req, res) => {
  const createdQuestion = await questionService.create(req.body);
  return res.json(createdQuestion);
};

module.exports = {
  getQuestions,
  createQuestion,
};
