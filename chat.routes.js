const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");

const {
  startConversation,
  getConversations,
  getMessages,
  sendMessage,
} = require("../controllers/chat.controller");

// Conversations
router.post("/conversations", verifyToken, startConversation);
router.get("/conversations", verifyToken, getConversations);

// Messages within a conversation
router.get("/conversations/:conversationId/messages", verifyToken, getMessages);
router.post("/conversations/:conversationId/messages", verifyToken, sendMessage);

module.exports = router;
