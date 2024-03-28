const express = require('express');
const router = express.Router();
const messageController = require('../Controllers/messageController');

// Route for creating a new message
router.post('/messages', messageController.createMessage);

// Route for getting all messages
router.get('/messages', messageController.getAllMessages);

// Route for getting a message by ID
router.get('/messages/:id', messageController.getMessageById);

// Route for updating a message by ID
router.put('/messages/:id', messageController.updateMessage);

// Route for deleting a message by ID
router.delete('/messages/:id', messageController.deleteMessage);

module.exports = router;
