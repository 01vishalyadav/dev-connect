const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(socket, next) {
  const token = socket.handshake.auth.token;
  if(!token)  next(new Error('token not provided for socket connection'));
  if(token=='token'){
    console.log('middlewareSAuth: authorised successfully for socket');
    next();
  }
  else{
    next(new Error('invalid token for socket connection'));
  }
  
  // // if token provided, check for its validity
  // try {
  //   const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
  //   socket.user = decoded // add socket.user._id = decoded
  //   console.log('user authorised successfully for socket connection');
  //   next();
  // }
  // catch(ex){
  //   next(new Error('invalid token for socket connection'));
  // }
}