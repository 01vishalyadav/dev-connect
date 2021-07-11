const {User} = require('../models/user');
const mongoose = require('mongoose');
const {Conversation} = require('../models/conversation');
const {Message} = require('../models/message');
const authorization = require('./socketIOMiddlewares/authorization');

module.exports = function(io){
  // check authorization of this new socket connection
  io.use(authorization);

  io.on('connection', (socket) => {
    console.log('new user connected');
    let onlineUserIds = [];
    for(var onlineUserId of io.onlineUserIdSocketMap.keys()) {
      onlineUserIds.push(onlineUserId);
    }
    socket.emit('onlineUsers', {
      onlineUserIds: onlineUserIds,
    })
    io.onlineUserIdSocketMap.set(socket.user._id, socket);
    /* 
    get all conversations in which this user is involved (can attach all convIds in which this user is participated with this socket at the time of authentication)
    for each such conversation:
        join room with this conversationId
    broadcast that userId connected to each socket
    send list of online users to this socket (socket.emit('users', {users:[]}))
    */

   // add this user to all conversationIds room
   socket.conversationIds.forEach((conversationId, index)=>{
      console.log('adding this socket to all convIds room:');
      socket.join(String(conversationId));
    })
    // send userBecameOnline event to all users
    console.log('broadcasting userBecameOnline...');
    socket.broadcast.emit('userBecameOnline',{from: socket.user._id});
    // set this user as connected in db
    User.findByIdAndUpdate(socket.user._id, {
      '$set':{ isConnected: true, socketId: socket.user._id }
    }, (err, result) => {
      if(err) return console.log('could not set this user as connected in db', err);
      console.log('successfully set this user as connceted in db');
    });

    //emit this from client side immediately after a new conversation is created
    socket.on('updateConversationIds', (dataObj) => {
      // add new this socekt to new convId room***********
      Conversation.find(
        {participants: socket.user._id},
        (err,ids)=>{
          if(err) return next (new Error('error serching conversationIds'));
          console.log('socketAuth, convIds:', ids);
          socket.conversationIds=[];
          ids.forEach((idObj)=>{
            socket.conversationIds.push(idObj._id);
          });
        }
      ).select('_id');
    });
    

    socket.on('disconnect', () => {
      io.onlineUserIdSocketMap.delete(socket.user._id);
      /* 
      broadcast that this userId desconnected with lastSeenAt,
      update lastSeenAt for this userId in the db
      */













      const lastSeenAt = Date.now();
      // send userBecameOffline event to all users
      console.log('broadcasting userBecameOffline..._id', socket.user._id);
      io.emit('userBecameOffline',{from: socket.user._id, lastSeenAt: lastSeenAt});
      // update this user's status to disconnected
      User.findByIdAndUpdate(socket.user._id,{
        '$set': {isConnected: false, socketId: '', lastSeenAt: lastSeenAt},
      }, (err, result) => {
        if(err) return console.log('could not set this user as disconnected in db.', err);
        console.log('successfully set this user as disconnected in the db');
      });
    });

    // handle new message
    socket.on('newMessage', async (dataObject, callback) => {
      console.log('newMessage event');
      /*
      save this message in db and broadcast this message in this conversationId room (assuming it has already been checked in the auth middleware that this userId is in this conversationId)
      
      */


      // check if conversation with conversationId has userId and sendToUserId as participants
      const conversationId = dataObject.conversationId;// check it if it is a type of obectId
      // check if this conversation has this userId as a participant
      let found = socket.conversationIds.find(convId=>convId==conversationId);
      if(!found)  return console.log('not allowed to participate in this conversation!');
      // create new Message in db and save
      const message = new Message({
        conversationId: dataObject.conversationId,
        from: socket.user._id,
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
        const dataToSendToClient = {
          success: true,
          message: doc
        };
        console.log('emitting gotNewMessage to convId room:', conversationId);
        io.in(String(conversationId)).emit('gotNewMessage', {
          from: socket.user._id,
          message: doc,
        });
        callback(dataToSendToClient);
      });
    });    
  });
}