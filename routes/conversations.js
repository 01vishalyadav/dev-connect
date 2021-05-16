const express = require('express');
const {Conversation} = require('../models/conversation');
const {User} = require('../models/user');
const authorization = require('../middlewares/authorization');

const router = express.Router();

// get a conversation
router.get('/:conversationId', authorization, async(req,res)=>{
  // user is a registered user
  // now check if this user is a participant in the conversation
  let conversation = await Conversation.findById(req.params.conversationId);
  if(!conversation) return res.status(400).send('conversation not found');
  const conversationParticipants = conversation.participants;
  const indexOfRequester = conversationParticipants.indexOf(req.user._id);
  if(indexOfRequester == -1)  return res.status(400).send('conversation not found');

  // if requester is a participant in this conversation
  // send conversation, so that user can see lastActive property of it
  res.send(conversation);
});

////////////  get all conversations  //////////////
router.get('/', authorization, async(req,res)=>{
  // return all conversations in which this user is paritcipated
  Conversation.find(
    {participants: req.user._id},
    (err,docs)=>{
      if(err) return res.status(400).send('error serching conversations');
      res.send(docs);
    }
  );
});

/////////// create a new conversation  /////////////
// request for it when a new message is sent from a user for the first time to his/her friend
router.post('/', authorization, async(req,res)=>{
  // requires friendUserId in the req.body.friendUserId
  // check if friendUserId is a friend of this user (req.user._id)
  let user = await User.findById(req.user._id);
  if (user.friends.indexOf(req.body.friendUserId) == -1)  return res.status(400).send('not your friend or invalid friendUserId');
  // if your friend, create a conversation
  let conversation = new Conversation({
    participants: [req.user._id, req.body.friendUserId],
  });
  conversation = await conversation.save();
  // return conversation
  res.send(conversation);
})

module.exports = router;