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
      // send userBecameOnline event to all users
      console.log('broadcasting userBecameOnline...');
      io.emit('userBecameOnline',{from: dataObject.userId});
      // set this user as connected in db
      User.findByIdAndUpdate(socket.userId, {
        '$set':{ isConnected: true, socketId: socket.id }
      }, (err, result) => {
        if(err) return console.log('could not set this user as connected in db', err);
        console.log('successfully set this user as connceted in db');
      });
    });

    socket.on('disconnect', () => {
      const lastSeenAt = Date.now();
      // send userBecameOffline event to all users
      console.log('broadcasting userBecameOffline..._id', socket.userId);
      io.emit('userBecameOffline',{from: socket.userId, lastSeenAt: lastSeenAt});
      // update this user's status to disconnected
      User.findByIdAndUpdate(socket.userId,{
        '$set': {isConnected: false, socketId: '', lastSeenAt: lastSeenAt},
      }, (err, result) => {
        if(err) return console.log('could not set this user as disconnected in db.', err);
        console.log('successfully set this user as disconnected in the db');
      });
    });

    // handle new message
    socket.on('newMessage', async (dataObject, callback) => {
      // userId already verified at authoriazion time of io connection
      // const userId = socket.user._id
      const userId = socket.userId;//change it to upper row for security
      const sendToUserId = dataObject.sendTo;
      // check if conversation with conversationId has userId and sendToUserId as participants
      const conversationId = dataObject.conversationId;// check it if it is a type of obectId

      ///if you want to chat with a new user, firstly, create a conversation by making request and then use that conversationId here
      if(!conversationId){
        dataToSendToClient={
          success: false,
          error: {
            code: 'CONV_ID_NOT_SET',
             message:'conversationId is not set in client dataObect'
            }
        }
        callback(dataToSendToClient);
        return console.log('conversationId is not set in client dataObect');
      }
      if(!mongoose.Types.ObjectId.isValid(conversationId)){
        dataToSendToClient={
          success: false,
          error: {
            code: 'CONV_ID_NOT_OBJECTID',
             message:'conversationId is not a objectId type'
            }
        }
        callback(dataToSendToClient);
        return console.log('conversationId is not a objectId type');
      }
      
      const conversation = await Conversation.findById(conversationId, (err, conv)=> {
        if(err) {
          const dataToSendToClient={
            success: false,
            error: {
              code: 'SEARCH_CONV_ERR',
               message:'err in searching conversation'
              }
          }
          callback(dataToSendToClient);
          return console.log('err in searching conversation, err:', err);
        }
      });

      if(!conversation){
        const dataToSendToClient={
          success: false,
          error: {
            code: 'CONV_DOES_NOT_EXIST',
             message:'conversation does not exist'
            }
        }
        callback(dataToSendToClient);
        return console.log('conversation does not exist');
      }
      //now, conversation exist
      // check if participants are userId and sendToUserId
      // it will ensure that sendToUser is friend and also it exist
      const participants = conversation.participants;
      // only valid for 121 conversation right now
      if(!((participants[0]==userId && participants[1]==sendToUserId) || (participants[0]==sendToUserId && participants[1]==userId))) {
        const dataToSendToClient={
          success: false,
          error: {
            code: 'NOT_A_PARTICIPANT',
             message:'There is no such conversation for you'
            }
        }
        callback(dataToSendToClient);
        return console.log('mainEventHandler: There is no such conversation for you');
      }
      
      // if sendToUserId is connected
      User.findById(sendToUserId, async (err, sendToUser)=>{
        if(err) {
          const dataToSendToClient={
            success: false,
            error: {
              code: 'ERR_FINDING_OTHER_USER',
               message:'error finding user'
              }
          }
          callback(dataToSendToClient);
          return console.log('error finding user', err);
        }
        // commented it because, on front end I need messageId to create
        // new MessageItem, so I need to save It to db first
        // In future, I have to do it without the help of db,
        // but for now, I am using db generated message it, I know
        // that it makes app slow

        // if(sendToUser.isConnected){
        //   console.log('sendToUser is also connected');
        //   console.log(`sending to socketId: ${sendToUser.socketId}`);
        //   io.to(sendToUser.socketId).emit('gotNewMessage',
        //     {
        //       from: socket.userId,
        //       message:dataObject.message,
        //     }
        //   );
        // }
        // else{
        //   console.log('sendToUser is not connected right now');
        // }
        //save this message 
        const message = new Message({
          conversationId: dataObject.conversationId,
          from: socket.userId,
          content: dataObject.message,
        });
        await message.save((err,doc) => {
          if(err) {
            const dataToSendToClient={
              success: false,
              error: {
                code: 'ERR_IN_SAVING_MSG_TO_DB',
                message:'error in saving message to db'
              }
            }
            callback(dataToSendToClient);
            return console.log('error in saving message to db, err:', err);
          }
          const dataToSendToClient={
            success: true,
            message: doc
          };
          if(sendToUser.isConnected){
            console.log('sendToUser is also connected');
            console.log(`sending to socketId: ${sendToUser.socketId}`);
            io.to(sendToUser.socketId).emit('gotNewMessage',
              {
                from: socket.userId,
                message: doc,
              }
            );
          }
          else{
            console.log('sendToUser is not connected right now');
          }


          //send data to sender client for ack and for show it in the messageItemList using messageId
          callback(dataToSendToClient);
          console.log('message successfully saved in db');
        });
      });
      
    });    
  });
}