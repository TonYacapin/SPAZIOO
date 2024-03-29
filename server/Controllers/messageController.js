const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

//@description     Get all Messages for a chat
//@route           GET /api/message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//@description     Create New Message
//@route           POST /api/message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    // Create a new Message instance
    var messageInstance = new Message(newMessage);

    // Save the new message
    var savedMessage = await messageInstance.save();

    console.log("New Message after creation:", savedMessage);

    // Retrieve the saved message with populated fields
    var populatedMessage = await Message.findById(savedMessage._id)
      .populate("sender", "name pic")
      .populate("chat");

    console.log("New Message after populating:", populatedMessage);

    // Update the latestMessage field of the corresponding Chat document
    await Chat.findByIdAndUpdate(chatId, { latestMessage: populatedMessage });

    res.json(populatedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




module.exports = { allMessages, sendMessage };
