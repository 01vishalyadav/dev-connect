const jwt = require('jsonwebtoken');
const config = require('config');
const { Conversation } = require('../../models/conversation');

module.exports = function(socket, next) {
  const token = socket.handshake.auth.token;
  if(!token)  next(new Error('token not provided for socket connection'));
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    socket.user = decoded;
    Conversation.find(
      {participants: socket.user._id},
      (err,ids)=>{
        if(err) return next (new Error('error serching conversationIds'));
        socket.conversationIds=[];
        ids.forEach((idObj)=>{
          socket.conversationIds.push(idObj._id);
        })
        console.log('socketAuth, set socket.convIds:');
        next();
      }
    ).select('_id');
  }
  catch(err) {
    console.log('socketIO auth middleware err');
    next(new Error('invalid token for socket connection'));
  }
}