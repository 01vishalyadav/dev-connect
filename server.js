
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
// allow every client to connect to this api
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();



io.on('connection', (socket) => {
  console.log(`a user connected, socket = ${socket}`);
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('chat message', (message) => {
    console.log(`Got a message from client: ${message}`);
  });
});

// make server listen on PORT
const PORT = 3333 || Node.env.PORT;
server.listen(PORT, ()=> {
  console.log(`listening on port ${PORT}`);
});