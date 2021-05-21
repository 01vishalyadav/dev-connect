
const socket = io({
  auth: {
    token: 'token',
  }
});
socket.on('connect_error', (err) => {
  console.log(`could not connect to socket, err: ${err.message}`);
});


console.log('working');
function setMeAsConnected (){
  console.log('setMeAsConnected initiated');
  const myUserId = document.getElementById('myUserId').value;
  console.log(myUserId);
  socket.emit('new user', {userId: myUserId});
}
document.getElementById('setConnectedButton').addEventListener('click',setMeAsConnected);

function sendMessage(){
  console.log('sending a message to user2');
  const message = document.getElementById('message').value;
  const sendToId = document.getElementById('sendToId').value;
  const conversationId = document.getElementById('conversationId').value;
  socket.emit('newMessage', 
  {sendTo: sendToId, conversationId: conversationId, message: message});
}
document.getElementById('sendButton').addEventListener('click', sendMessage);
// handle getting new message
socket.on('gotNewMessage', (dataObject) => {
  const from = dataObject.from;
  const message = dataObject.message;

  console.log(`got new message from: ${dataObject.from}, content is: ${dataObject.message}`);

  // create a new li
  var liNode = document.createElement('li');
  var textNode = document.createTextNode(message);
  liNode.appendChild(textNode);
  // append li to ul
  document.getElementById('newMessagesList').appendChild(liNode)
});
