const express = require("express");
const router = express();

const knowledgeController = require("../controllers/knowledge.controller");

router.get("/", knowledgeController.getKnowledges);
router.post("/ask", knowledgeController.getKnowledge);
router.post("/", knowledgeController.createKnowledge);
router.put("/:id", knowledgeController.updateKnowledge);
router.delete("/:id", knowledgeController.deleteKnowledge);

module.exports = router;
