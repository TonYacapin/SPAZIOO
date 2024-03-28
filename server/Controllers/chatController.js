const Chat = require('../models/ChatModel');

// Create a new chat or add message to existing chat
exports.createChat = async (req, res) => {
    try {
        const { chatName, isGroupChat, users, latestMessage, groupAdmin } = req.body;
        
        // Check if a chat with the same users exists
        const existingChat = await Chat.findOne({ users: { $all: users } });

        if (existingChat) {
            // Update the latestMessage field of the existing chat
            existingChat.latestMessage = latestMessage;
            const updatedChat = await existingChat.save();
            return res.status(200).json(updatedChat);
        }

        // If no existing chat found, create a new chat
        const newChat = new Chat({ chatName, isGroupChat, users, latestMessage, groupAdmin });
        const savedChat = await newChat.save();
        res.status(201).json(savedChat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all chats that the user is part of
exports.getAllUserChats = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is available in req.user
        const userChats = await Chat.find({ users: userId });
        res.status(200).json(userChats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.fetchChats = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is available in req.user

        // Find all chats where the user is included in the users array
        const userChats = await Chat.find({ users: userId })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 });

        if (!userChats || userChats.length === 0) {
            return res.status(404).json({ message: 'No chats found for the user' });
        }

        res.status(200).json(userChats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get a chat by ID
exports.getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a chat by ID
exports.updateChat = async (req, res) => {
    try {
        const updatedChat = await Chat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a chat by ID
exports.deleteChat = async (req, res) => {
    try {
        const deletedChat = await Chat.findByIdAndDelete(req.params.id);
        if (!deletedChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
