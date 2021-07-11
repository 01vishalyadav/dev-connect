const express = require('express');
const mongoose = require('mongoose');
const {Conversation} = require('../models/conversation');
const { Message } = require('../models/message');
const {User} = require('../models/user');
const { getConversation } = require('../models/conversation');
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

////////////  get all conversations having this user  //////////////
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

// create a function to create new conversation so that we can
// reuse it in socketIO folder



// request for it when a new message is sent from a user for the first time to his/her friend
// for now, lets make it public for all, anyone who have an account can talk to anyone(create conversation with any otherUser)
router.post('/', authorization, async(req,res)=>{
  // requires otherUserId in the req.body.ohterUserId and your user id in req.user._id
  // check if there is already a conversationId for these two users(one to one)
  const userId = mongoose.Types.ObjectId(req.user._id);
  const otherUserId = mongoose.Types.ObjectId(req.body.otherUserId);
  if(userId == otherUserId)
    return res.status(400).send('A user cannot communicate to himself/herself');
    
  // console.log('req.user._id=', userId);
  // console.log('req.body.OtherUserId:', otherUserId);
  Conversation.find({
    participants:{
      '$all':[userId, otherUserId],
      '$size':2,
    }
  }, (err, result)=>{
    if(err)
      return res.status(400).send('err:error in finding participants, err:'+err);
    if(result && result.length===1){
      // conversation already exist, don't need to create a new, return this
      console.log('conversation already exist');
      return res.send(result[0]);
    }
    else{
      console.log('conversation does not exist, going to create a new one...');
      // create a new conversation
      const conversation = new Conversation({
        participants:[req.user._id, otherUserId]
      });
      conversation.save((err,doc)=>{
        if(err) return res.status(400).send('could not create a conversation');
        /*
        add thisUser and otherUser to a room (conversationId room)

        */
       const io = req.app.get('io');
        // check if u have updated list of io.onlineUsers
        for(let i=0;i<2;i=i+1)  {
          const userId = doc.participants[i];
          const socket = io.onlineUserIdSocketMap.get(String(userId));
          
          if(io.onlineUserIdSocketMap.has(String(userId))) {
            console.log('have userId', userId);
          }
          else {
            console.log('dont have userId', userId);
          }
          if(socket)  {
            console.log('emitting to socket with userId', userId);
            socket.emit('newConversation', {conversation: doc});
            socket.conversationIds.push(doc._id);
            console.log(`${userId} joining ${doc._id}`);
            socket.join(String(doc._id));
          }
        }        
        //now send the response if above code runs without error, so put above in try catch block...
        res.send(doc);
      });
    }
  })

  // as of now, anyone can chat with anyone, don't need to be friend
  // {let user = await User.findById(req.user._id);
  // if (user.friends.indexOf(req.body.friendUserId) == -1)  return res.status(400).send('not your friend or invalid friendUserId');
  // if your friend, create a conversation}
  // let conversation = new Conversation({
  //   participants: [req.user._id, req.body.otherUserId],
  // });
  // conversation = await conversation.save();
  // // return conversation
  // res.send(conversation);
});

///////////////   Get all messages for a given conversationId   /////////////
router.get('/:conversationId/messages',authorization, async(req,res)=>{
  
  let conversation = await Conversation.findById(req.params.conversationId);
  if(!conversation) return res.status(400).send('conversation not found');
  const conversationId = req.params.conversationId;
  // return all messages with conversationId in it
  Message.find({conversationId:conversationId},
    (err,result)=>{
      if(err) return res.status(400).send('db error in getting conversation:', err);
      res.send(result);
    });
});

/////// create a new message for a given conversationId /////////
// content should be in the body of the request
// using conversationId from params gives undefined if :conversationId is not present in router.post url at currnt time
router.post('/:conversationId/messages', authorization, async(req,res)=> {
  const conversation = getConversation(req.params.conversationId);
  if(!conversation) return res.status(400).send('conversaton not found');
  const conversationId = req.params.conversationId;
  const message = new Message({
    conversationId: conversationId,
    content: req.body.content,
    from: req.user._id,
  });
  await message.save()
  res.send('message saved to db.');
});



module.exports = router;