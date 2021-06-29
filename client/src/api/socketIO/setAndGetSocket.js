import { io } from "socket.io-client";

export default function setAndGetSocket (token) {
  // connect to server using socket
  try {
    const socket = io(('/'),{
      auth: {
        token: token,
      }
    });
    socket.on('connect_error', (err) => {
      console.log(`could not connect to socket, err: ${err.message}`);
      return new Error(err);
    });
    return socket;
  }
  catch(error){
    return new Error(error);
  }
}