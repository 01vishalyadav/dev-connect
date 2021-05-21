const express = require('express');
const { Message } = require('../models/message');
const authorization = require('../middlewares/authorization');
const { getConversation } = require('../models/conversation');
const router = express.Router();

// get all messages of a given conversationId
router.get('/', async(req, res) => {  
  const conversation = getConversation(req.params.conversationId);
  if(!conversation) return res.status(400).send('conversaton not found');
  const conversationId = conversation._id;
  // return all messages with conversationId in it
  Message.find({conversationId:conversationId},
    (err,result)=>{
      if(err) return res.status(400).send('db error in getting conversation:', err);
      res.send(result);
    });
});

/////// create a new message  /////////
// messageContent should be in the body of the request
router.post('/', async(req,res)=> {
  const message = new Message({
    conversationId: req.params.conversationId,
    content: req.body.messageContent,
    from: req.user._id,
  });
  await message.save()
  res.send('message saved to db.');
});

module.exports = router;