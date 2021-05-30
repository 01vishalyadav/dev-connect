import React, {useState, useEffect, useRef} from 'react';
import MessageItem from '../MessageItem/MessageItem';
import getAllMessages from '../api/messages/getAllMessages';
import getAConversation from '../api/Conversations/getAConversation';
import getAUser from '../api/users/getAUser';
import getMe from '../api/users/getMe';
import sendMessage from '../api/socketIO/sendMessage';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Icon,Button,IconButton, Card, CardContent, List, ListItem, ListItemText, CardHeader, Typography, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

export default function MessageItemList(props){
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [conversationTitle, setConversationTitle] = useState("default");
  const [me, setMe] = useState();
  const [otherUser, setOtherUser] = useState();
  const [sendMessageContent, setSendMessageContent] = useState('');
  const [socket, setSocket] = useState(null);
  const [gotNewMessage, setGotNewMessage] = useState(false);
  const [gotNewMessageDataObject, setGotNewMessageDataObject] = useState(null);
  const[eventListenerInitialized, setEventListenerInitialized] = useState(false);
  const [messageItemList, _setMessageItemList] = useState([]);
  // define a ref to messageItemList
  const messageItemListRef = useRef(messageItemList);
  // in place of original setMessageItemList
  const setMessageItemList = (newMessageItemList) => {
    messageItemListRef.current = newMessageItemList;//keeps updated
    _setMessageItemList(newMessageItemList);
  }
  const conversationId = props.conversationId;

  
  async function getAndSetConversationTitle(conversation){
    let otherUserId=null;
    if(props.user._id==conversation.participants[0])
      otherUserId = conversation.participants[1];
    else
      otherUserId = conversation.participants[0];
    getAUser(otherUserId)
      .then((_otherUser)=>{
      setConversationTitle(_otherUser.firstName);
      console.log('_otherUser:', _otherUser);
      setOtherUser(_otherUser);
    })
      .catch(err=>{
        console.log('error in getting other user, err:',err);
    })
      .finally(()=>{

    })
    
  }

  // make sure that props has socket***********
  // props.socket.on('gotNewMessage', (dataObject) => {
  //   console.log('inside props.socket.on!');
  //   setGotNewMessageDataObject(dataObject);
  //   setGotNewMessage(true);
  // });

  useEffect(()=>{
    if(socket===null){
      console.log('setting socket which was got from props');
      if(props.socket)
        setSocket(props.socket);
      else
        console.log('err: props.socket is null');
    }
    
    if(props.conversationTitle!==null && props.otherUser){
      setConversationTitle(props.conversationTitle);
      setOtherUser(props.otherUser);
      
    }
    else{
      console.log('could not get the User or conversationTitle from props, may lead to bugs!');
      getAConversation(conversationId)
        .then((conversation)=>{
          getAndSetConversationTitle(conversation)
            .then((_conversationTitle)=>{
              console.log('useEffect: successfully set conversationTitle!')
          });
      })
        .catch(err=>console.log('err in getting a conversation by Id, err:',err))
        .finally(()=>{
          setIsLoading(false);
      });
    }

    getAllMessages(conversationId).then((messages)=>{  
      if(messages.length>0){
        let _messageItemList = messages.map((message,index)=>{
          return <MessageItem 
                    message={message} 
                    key={message._id}
                    user={props.user}
                  />
        });
        console.log('messageItemListInitialized');
        setMessageItemList(_messageItemList);
      }
      else if(messages.length === 0){
        console.log('no previous messages');
        // setMessageItemList = [];
      }
    }).catch(err=>{
      console.log('getAllMessages-err: ',err)
    }).finally(()=>{
      setIsLoading(false);
    });
    

  },[]);

  function addNewMessageItem(newMessageItem){
    let newMessageItemList = [...(messageItemListRef.current), newMessageItem];
    setMessageItemList(newMessageItemList);
  }


  // make sure that this function runs only once*****
  if(!eventListenerInitialized){
    // create socket.on here becouse it runs for one time only, so socket.on event listener will be only created once. when I used socket.on outside(in MessageItemList function, it registered itself for many times and it called itself for number of renders(==number of listener instances))
    console.log('##### settng eventListener #####');
    props.socket.on('gotNewMessage', (dataObject) => {
      const fromUserId = dataObject.from;
      const GotNewMessage = dataObject.message;

      console.log(`got new message from: ${dataObject.from}, content is: ${dataObject.message.content}`);
      // create a new MessageItem
      console.log('creating a new MessageItem...');
      const newMessageItem = <MessageItem 
                                message={dataObject.message}
                                user = {props.user}
                                key = {dataObject.message._id}
                             />
      // add newMessageItem at the end of messageItemList state
      // react will use older value of messageItemList which is [], to addNewMessageItem, because event listener will use value at the time it was registered. Use useRef to solve this issue
      addNewMessageItem(newMessageItem);
    });
    setEventListenerInitialized(true);
  }

  function sendIconClickedHandler(){
    // it is executed when sendMessage() gets a response from the server
    function onResponse(response){
      // first check if message was successfully sent or not 
      if(response.success){
        console.log('successfully sent message, response:', response);
        setSendMessageContent('');
        // add a messageItem at the end of messageItemList,
        // messageItem requiers:
        // 1.const {from, content, _id, conversationId, createdAt, status} = props.message;
        // 2.const userId = props.user._id;
        const newMessageItem = <MessageItem 
                                message={response.message}
                                user = {props.user}
                                key = {response.message._id}
                              />
        // add newMessageItem at the end of messageItemList state
        addNewMessageItem(newMessageItem);
      }
    }
    if(sendMessageContent=='')  return;
    console.log('send message: ',sendMessageContent);
    console.log('otherUser:',otherUser);
    sendMessage(socket, props.otherUser._id, conversationId, sendMessageContent, onResponse); 
    
  }

  function sendMessageContentChangedHandler(e){
    setSendMessageContent(e.target.value);
  }

  return(
    <Container maxWidth="lg" >
      {/* <Grid container>
        <Grid item> */}
          <Card>
            <CardHeader title={conversationTitle=='default'?<p>Loading...</p>:conversationTitle} />
            <CardContent>
              <List>
                {isLoading ? <h5>Loading...</h5>:messageItemList}
              </List>
              <form style={{position:'fixed'}}  noValidate autoComplete="off" 
                    style={{width:'inherit'}}
                    onSubmit={e=>{e.preventDefault();sendIconClickedHandler()}}
              >
                <TextField 
                  id="outlined-basic" 
                  label="Type new Message"       
                  variant="outlined" 
                  fullWidth
                  onChange={(e)=>sendMessageContentChangedHandler(e)}
                  value={sendMessageContent}
                />
                <IconButton 
                  onClick={(e)=>sendIconClickedHandler(e)}
                  color="primary" 
                  aria-label="send message" 
                  component="span"
                >
                  <SendIcon  />
                </IconButton>
              </form>

            </CardContent>
          </Card>
      
        {/* </Grid>
      </Grid>   
      <Grid container>
        <Grid item>           */}
           
        {/* </Grid>
      </Grid> */}
    </Container>
  );
}