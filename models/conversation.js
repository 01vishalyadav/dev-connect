const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const conversationSchema = new mongoose.Schema({
  participants: [{ type:ObjectId }],
  lastActive: {
    type:Date,
    default: Date.now,
    required: true,
  }
});
const Conversation = mongoose.model('Conversation', conversationSchema);

// get a conversation by conversationId
function getConversation(conversationId){
  return Conversation.findById(conversationId);
}


exports.Conversation=Conversation;
exports.getConversation = getConversation;