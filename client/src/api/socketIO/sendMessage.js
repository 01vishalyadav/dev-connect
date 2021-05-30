export default function sendMessage(socket,sendToUserId, conversationId, messageContent, onResponse){
  console.log('sending a message to userId:', sendToUserId);
  socket.emit('newMessage', 
  {sendTo: sendToUserId, conversationId: conversationId, message: messageContent}, (response)=>{
    console.log(response);
    onResponse(response);
  });
}