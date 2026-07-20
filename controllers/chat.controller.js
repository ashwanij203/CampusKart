const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// ================= START / GET CONVERSATION =================
// POST /api/chat/conversations  { productId, sellerId }
exports.startConversation = async (req, res) => {
  try {
    const { productId, sellerId } = req.body;
    const buyerId = req.user.id;

    if (!productId || !sellerId) {
      return res.status(400).json({
        success: false,
        message: "productId and sellerId are required",
      });
    }

    // Prevent seller chatting with themselves
    if (buyerId === sellerId) {
      return res.status(400).json({
        success: false,
        message: "You cannot start a conversation with yourself",
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      product: productId,
      participants: { $all: [buyerId, sellerId] },
    })
      .populate("participants", "name email profileImage")
      .populate("product", "title images price");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [buyerId, sellerId],
        product: productId,
      });

      await conversation.populate("participants", "name email profileImage");
      await conversation.populate("product", "title images price");
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY CONVERSATIONS =================
// GET /api/chat/conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate("participants", "name email profileImage")
      .populate("product", "title images price")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MESSAGES FOR A CONVERSATION =================
// GET /api/chat/conversations/:conversationId/messages
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Make sure user is part of this conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversationId, sender: { $ne: req.user.id }, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= SEND MESSAGE =================
// POST /api/chat/conversations/:conversationId/messages
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    // Make sure user is part of this conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const message = await Message.create({
      conversationId,
      sender: req.user.id,
      text: text.trim(),
    });

    await message.populate("sender", "name profileImage");

    // Update conversation last message
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
