const {User} = require('../models/user');
const mongoose = require('mongoose');
const {Conversation} = require('../models/conversation');
const {Message} = require('../models/message');
const authorization = require('./socketIOMiddlewares/authorization');

module.exports = function(io){
  // check authorization of this new socket connection
  io.use(authorization);

  io.on('connection', (socket)=>{
    console.log('new user connected but not marked it as connected');
    // when a client marks itself as connected
    socket.on('new user', (dataObject) => {
      console.log('newUser request');
      if(mongoose.Types.ObjectId.isValid(dataObject.userId) == false){
        return console.log('Not a objectId type');
      }
      socket.userId = dataObject.userId;
      // set this user as connected in db
      User.findByIdAndUpdate(socket.userId, {
        '$set':{ isConnected: true, socketId: socket.id }
      }, (err, result) => {
        if(err) return console.log('could not set this user as connected in db', err);
        console.log('successfully set this user as connceted in db');
      });
    });

    socket.on('disconnect', () => {
      // update this user's status to disconnected
      User.findByIdAndUpdate(socket.userId,{
        '$set': {isConnected: false, socketId: ''},
      }, (err, result) => {
        if(err) return console.log('could not set this user as disconnected in db.', err);
        console.log('successfully set this user as disconnected in the db');
      });
    });

    // handle new message
    socket.on('newMessage', async (dataObject) => {
      // userId already verified at authoriazion time of io connection
      // const userId = socket.user._id
      const userId = socket.userId;//change it to upper row for security
      const sendToUserId = dataObject.sendTo;
      // check if conversation with conversationId has userId and sendToUserId as participants
      const conversationId = dataObject.conversationId;// check it if it is a type of obectId
      if(!conversationId) return console.log('conversationId is not set in client dataObect');
      if(!mongoose.Types.ObjectId.isValid(conversationId)){
        return console.log('conversationId is not a objectId type');
      }
      
      const conversation = await Conversation.findById(conversationId, (err, conv)=> {
        if(err) return console.log('err in searching conversation, err:', err);
      });

      if(!conversation){
        return console.log('conversation does not exist');
      }
      //now, conversation exist
      // check if participants are userId and sendToUserId
      // it will ensure that sendToUser is friend and also it exist
      const participants = conversation.participants;
      // only valid for 121 conversation right now
      if(!((participants[0]==userId && participants[1]==sendToUserId) || (participants[0]==sendToUserId && participants[1]==userId))) {
        return console.log('mainEventHandler: There is no such conversation for you');
      }
      
      // if sendToUserId is connected
      User.findById(sendToUserId, async (err, sendToUser)=>{
        if(err) return console.log('error finding user', err);
        if(sendToUser.isConnected){
          console.log('sendToUser is also connected');
          console.log(`sending to socketId: ${sendToUser.socketId}`);
          io.to(sendToUser.socketId).emit('gotNewMessage',
            {
              from: socket.userId,
              message:dataObject.message,
            });
        }
        else{
          console.log('sendToUser is not connected right now');
        }
        //save this message 
        const message = new Message({
          conversationId: dataObject.conversationId,
          from: socket.userId,
          content: dataObject.message,
        });
        await message.save((err,doc) => {
          if(err) return console.log('error in saving message to db, err:', err);
          console.log('message successfully saved in db');
        });
      });
      
    });
    
  });
}