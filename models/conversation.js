
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type:ObjectId,
    }
  ],
  lastActive: {
    type:Date,
    default: Date.now,
    required: true,
  }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

exports.Conversation=Conversation;
