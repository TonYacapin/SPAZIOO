const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');

// Route for creating a new chat or adding a message to an existing chat
router.post('/chats', chatController.createChat);

// Route for getting all chats that the user is part of
router.get('/chats', chatController.fetchChats);

// Route for getting a chat by ID
router.get('/chats/:id', chatController.getChatById);

// Route for updating a chat by ID
router.put('/chats/:id', chatController.updateChat);

// Route for deleting a chat by ID
router.delete('/chats/:id', chatController.deleteChat);

module.exports = router;
