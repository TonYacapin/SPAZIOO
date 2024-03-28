const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose

const chatSchema = new Schema({
    chatName: {
      type: String,
      required: true
    },
    isGroupChat: {
      type: Boolean,
      default: false
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
