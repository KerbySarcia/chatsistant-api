const express = require("express");
const router = express();

const questionController = require("../controllers/question.controller");

router.get("/", questionController.getQuestions);
router.post("/", questionController.createQuestion);

module.exports = router;
