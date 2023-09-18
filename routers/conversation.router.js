const express = require("express");
const router = express();

const conversationController = require("../controllers/conversation.controller");

router.post("/", conversationController.createConversation);
router.post("/:id", conversationController.appedToConversation);
router.get("/:id", conversationController.getConversation);

module.exports = router;
