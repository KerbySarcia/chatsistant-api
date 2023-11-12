const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/auth.middleware");
const knowledgeController = require("../controllers/knowledge.controller");

router.get("/", authMiddleware.verifyAuth, knowledgeController.getKnowledges);
router.post(
  "/ask",
  authMiddleware.verifyAuth,
  knowledgeController.getKnowledge
);
router.post("/", knowledgeController.createKnowledge);
router.put("/:id", knowledgeController.updateKnowledge);
router.delete("/:id", knowledgeController.deleteKnowledge);

module.exports = router;
