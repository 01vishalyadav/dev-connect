import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import getAllMessages from '../api/messages/getAllMessages';
import getAConversation from '../api/Conversations/getAConversation';
import getAUser from '../api/users/getAUser';
import sendMessage from '../api/socketIO/sendMessage';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { IconButton, Card, ListItem, ListItemText, CardHeader, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";


export default function MessageItemList(props){
  const [isLoading, setIsLoading] = useState(true);
  const [conversationTitle, setConversationTitle] = useState("default");
  const [otherUser, setOtherUser] = useState();
  const [sendMessageContent, setSendMessageContent] = useState('');
  const [socket, setSocket] = useState(null);
  const[eventListenerInitialized, setEventListenerInitialized] = useState(false);
  let [messages, _setMessages] = useState([]);
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
  });

  // define a ref to messages
  const messagesRef = useRef(messages);
  // in place of original setMessages
  const setMessages = (newMessages) => {
    messagesRef.current = newMessages;//keeps updated
    _setMessages(newMessages);
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

    getAllMessages(conversationId).then((_messages)=>{  
      if(_messages.length>0){
        setMessages(_messages);
      }
      else if(_messages.length === 0){
        console.log('no previous messages');
        // setMessageItemList = [];
      }
    }).catch(err=>{
      console.log('getAllMessages-err: ',err)
    }).finally(()=>{
      setIsLoading(false);
    });    

  },[]);


  // make sure that this function runs only once*****
  if(!eventListenerInitialized){
    // create socket.on here becouse it runs for one time only, so socket.on event listener will be only created once. when I used socket.on outside(in MessageItemList function, it registered itself for many times and it called itself for number of renders(==number of listener instances))
    console.log('##### settng eventListener #####');
    props.socket.on('gotNewMessage', (dataObject) => {
      const fromUserId = dataObject.from;
      const GotNewMessage = dataObject.message;

      console.log(`got new message from: ${dataObject.from}, content is: ${dataObject.message.content}`);
      // create a new MessageItem
      console.log('creating a new Message');
      const message = dataObject.message;
      // add newMessageItem at the end of messageItemList state
      // react will use older value of messageItemList which is [], to addNewMessageItem, because event listener will use value at the time it was registered. Use useRef to solve this issue
      setMessages([...messagesRef.current, message]);
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
        // add a message at the end of messages,
        const message = response.message;
        setMessages([...messages, message])
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

  function renderRow({index, key, style, parent}) {
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index} >
        <div style={style}>
        <ListItem divider >
          <ListItemText
            primary={messages[index].content}
            secondary={moment(messages[index].createdAt).format('hh:mm:ss A, DD-MM-YY')}
            style={{textAlign:messages[index].from===props.user._id?"right":"left"}}
          />
        </ListItem>
        </div>
      </CellMeasurer>
    );
  }

  return(
    <Grid container spacing={3} >
      <Grid item xs={12}>
        <Card>
          <CardHeader title={conversationTitle=='default'?<p>Loading...</p>:conversationTitle}>
          </CardHeader>
        </Card>
      </Grid>
      <Grid item xs={12} style={{height:'50vh', backgroundColor:'(231,132,205)'}}>
        {isLoading?<h5>Loading...</h5>:
          <AutoSizer>
          {
            ({width, height}) => {
              return <List
                width={width}
                height={height}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
                rowRenderer={renderRow}
                rowCount={messages.length}
                overscanColumnCount={3} 
                  />
            }
          }
        </AutoSizer>
        }
      </Grid>
      <Grid item xs={12}>
      <form
          style={{positon:'fixed', margin:150 }}
          noValidate 
          autoComplete="off" 
          style={{width:'inherit'}}
          onSubmit={e=>{e.preventDefault();sendIconClickedHandler()}}>
          <Grid container>
            <Grid item xs={10}>
              <TextField 
                id="outlined-basic" 
                label="Type new Message"       
                variant="outlined" 
                autoFocus
                fullWidth
                onChange={(e)=>sendMessageContentChangedHandler(e)}
                value={sendMessageContent}
              />
            </Grid>
            <Grid item xs={2} style={{textAlign:'right'}}>
              <IconButton                  
                onClick={(e)=>sendIconClickedHandler(e)}
                color="primary" 
                aria-label="send message" 
                component="span" >
                <SendIcon   />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}