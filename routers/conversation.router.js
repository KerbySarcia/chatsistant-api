const express = require("express");
const router = express();
const authMiddleware = require("../middlewares/auth.middleware");
const conversationController = require("../controllers/conversation.controller");

router.post(
  "/",
  authMiddleware.verifyAuth,
  conversationController.createCommunication
);

router.get(
  "/:id",
  authMiddleware.verifyAuth,
  conversationController.getConversation
);

module.exports = router;
