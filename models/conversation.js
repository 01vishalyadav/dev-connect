
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type:ObjectId,
    }
  ],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

exports.Conversation=Conversation;
