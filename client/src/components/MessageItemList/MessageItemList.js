import React, {useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import getAllMessages from '../../api/messages/getAllMessages';
import sendMessage from '../../api/socketIO/sendMessage';
import Grid from '@material-ui/core/Grid';
import { IconButton, Card, ListItem, ListItemText, CardHeader, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";

export default function MessageItemList(props) {
  console.log('////rendering messageItemList');
  const isConnected = useSelector(state=>state.users.items.byId[props.otherUserId].isConnected);
  const user = useSelector(state=>state.authentication.user);
  const socket = useSelector(state=> state.socket.item);
  const otherUser = useSelector(state=>state.users.items.byId[props.otherUserId]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastSeen, setLastSeen] = useState('default');
  const [sendMessageContent, setSendMessageContent] = useState('');
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

  // to get other user's lastSeen
  useEffect(()=> {
    // console.log('storeOheruser:', isConnected);
    if(isConnected === true) {
      setLastSeen('online');
    }
    else{
      setLastSeen('last active at: '+moment(otherUser.lastSeenAt).format('hh:mm A, DD-MM-YY'));
    }
  }, [isConnected]);

  useEffect(()=>{
    getAllMessages(props.conversationId).then((_messages)=>{  
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
    socket.on('gotNewMessage', (dataObject) => {
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
    sendMessage(socket, props.otherUserId, props.conversationId, sendMessageContent, onResponse);    
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
            secondary={moment(messages[index].createdAt).format('hh:mm A, DD-MM-YY')}
            style={{textAlign:messages[index].from===user._id?"right":"left"}}
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
          <CardHeader 
            title={otherUser.firstName} 
            subheader={lastSeen}>
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
                noRowsRenderer={()=> 'No Messages Yet!'}
                rowCount={messages.length}
                overscanColumnCount={3}
                scrollToIndex={messagesRef.current.length-1}
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