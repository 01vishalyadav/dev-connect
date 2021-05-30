const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const config = requier('config');
const socketio = require('socket.io');
const handleMessagingEvents = require('./socketIO/mainEventHandler');

const app = express();
const server = http.createServer(app);
// allow every client to connect to this api
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});
// Static files
app.use(express.static(path.resolve(__dirname, `${config.get('staticFilePath')}`)));
// set io to use it in any router, using req.app.get('io')
app.set('io', io);

// middleware to authourize io
// io.use((socket,next) => {
  // const token = socket.handshake.auth.token;
  // try {
  //   const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
  //   req.user = decoded;
  //   console.log('user authorised successfully');
  //   next();
  // }
  // catch(ex){
  //   res.status(400).send('Invalid token for io');
  // }
  // console.log('io authorized');
  // next();
// })

require('./startup/routes')(app);
require('./startup/db')(app);
require('./startup/config')(app);
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './client/src', 'index.js'));
// });

// handle messaging events
handleMessagingEvents(io);


// make server listen on PORT
const PORT = 3333 || Node.env.PORT;
server.listen(PORT, ()=> {
  console.log(`listening on port ${PORT}`);
});