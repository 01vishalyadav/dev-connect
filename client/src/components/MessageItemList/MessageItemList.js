import React, {useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
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
  const messages = useSelector(state=>state.messages.items.byConversationId[props.conversationId]);
  // console.log(messages);
  const settingAllMessages = useSelector(state=>state.messages.settingAllMessages);

  
  const [isLoading, setIsLoading] = useState(true);
  const [lastSeen, setLastSeen] = useState('default');
  const [sendMessageContent, setSendMessageContent] = useState('');
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
  });

  useEffect(()=>{
    if(settingAllMessages) {
      setIsLoading(true);
    }
    else  setIsLoading(false);
  },[settingAllMessages]);

  useEffect(()=>{
    if(!messages) {
      
    }
  }, [messages]);


  // to get other user's lastSeen
  useEffect(() => {
    if(isConnected === true)   setLastSeen('online');
    else  setLastSeen('last active at: '+moment(otherUser.lastSeenAt).format('hh:mm A, DD-MM-YY'));
  }, [isConnected]);


  function sendIconClickedHandler() {
    // it is executed when sendMessage() gets a response from the server
    function onResponse(response){
      // check if message was successfully sent or not 
      if(response.success) {
        console.log('ack: successfully sent message, ackResponse:', response);
        setSendMessageContent('');
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
          !messages? <p>No messages yet</p>:
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
                scrollToIndex={messages.length-1}
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