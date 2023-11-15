const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/auth.middleware");
const knowledgeController = require("../controllers/knowledge.controller");
const knowledgeService = require("../services/knowledge.service");

router.get("/", authMiddleware.verifyAuth, knowledgeController.getKnowledges);
router.post(
  "/ask",
  authMiddleware.verifyAuth,
  knowledgeController.getKnowledge
);
router.post("/", knowledgeController.createKnowledge);
router.put("/:id", knowledgeController.updateKnowledge);
router.delete("/:id", knowledgeController.deleteKnowledge);
router.get("/subject", async (req, res) => {
  const subjects = await knowledgeService.getSubjects();
  return res.json(subjects);
});
router.get("/target", async (req, res) => {
  const targets = await knowledgeService.getTargets();
  return res.json(targets);
});

module.exports = router;
