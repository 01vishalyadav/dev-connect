import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {useSelector} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';


export default function ConversationItem(props) {
  const conversationId = props.conversationId;
  const user = useSelector(state=>state.authentication.user);
  const participants = useSelector(state=>state.conversations.items.byId[conversationId].participants);

  const otherUserId = participants[0]===user._id ?  participants[1]  :  participants[0];
  const otherUser = useSelector(state=>state.users.items.byId[otherUserId]);
  console.log(otherUser);
  console.log('convItem: otherUserId:', otherUserId);
  const messages = useSelector(state=>state.messages.items.byConversationId[conversationId]);
  const settingAllMessages = useSelector(state=>state.messages.settingAllMessages);
  const [isLoading, setIsLoading] = useState(true);

  let lastMessage = null;
  useEffect(()=>{
    if(!otherUser ) {
      setIsLoading(true);
    }
    else if(settingAllMessages) {
      setIsLoading(true);
    }
    else if(settingAllMessages===false && messages.length===0) {
      return (
        <p>No Messages yet</p>
      )
    }
    else {
      setIsLoading(false);
    }
  }, [otherUser, settingAllMessages, messages])
  if(messages && messages.length>0)
    lastMessage = messages[messages.length-1];

  // if(isLoading) {
  //   return (
  //     <p>Loading...</p>
  //   )
  // }
  
  function conversationItemClickedHandler(){
    console.log('conversationItem clicked with convId:', conversationId);
    props.conversationItemClicked(conversationId, 'not set', otherUser);
  }
 
  return (
    <Grid  container spacing={3}  >
      <Grid  item xs={12} >
        <Card onClick={()=>conversationItemClickedHandler()}>
          <Grid container justify="flex-start" spacing={10}>
            <Grid item>                
              <CardHeader 
                title={`${otherUser.githubId} ${otherUser.firstName && otherUser.firstName != ""? "(" + otherUser.firstName + (otherUser.lastName && otherUser.lastName != "" ? " " + otherUser.lastName : "") + ")" : ""} `}
                subheader={otherUser.isConnected?'online': 'last seen at ' + moment(otherUser.lastSeenAt).format('hh:mm A, DD-MM-YY')}/>
              <CardContent>
                <Typography variant="body1" color="initial">
                  {!lastMessage?"Conversation initiated but no messages yet":((lastMessage.from===user._id ? "You" : "Other Person") + ': ' + lastMessage.content)}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>      
  );
}