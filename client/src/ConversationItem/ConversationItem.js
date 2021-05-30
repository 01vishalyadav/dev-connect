import React, {useState, useEffect} from 'react';
import getAUser from '../api/users/getAUser';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';


export default function ConversationItem(props){
  const [conversationTitle, setConversationTitle] =  useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const {participants, lastActive, _id} = props.conversation;
  const userId = props.user._id;
  const withUserId = userId == participants[0] ? participants[0] : participants[1];
  // const conversationTitle = props.conversationTitle;
  useEffect(()=>{
    let otherUserId = props.conversation.participants[0] == props.user._id ? props.conversation.participants[1]: props.conversation.participants[0];
    getAUser(otherUserId).then(otherUser=>{
      console.log('ohteruser:', otherUser);
      setOtherUser(otherUser);
      setConversationTitle(otherUser.firstName);
    }).catch(err=>{
      console.log('conversationItem.js:- getAUser err:',err);
    })
  },[]);
  function conversationItemClickedHandler(){
    console.log('conversationItem clicked with convId:', _id);
    props.conversationItemClicked(_id, conversationTitle, otherUser);
  }
 
  return (
    <Grid  container spacing={3}  >
      <Grid  item xs={12} >
        <Card onClick={()=>conversationItemClickedHandler()}>
          <Grid container justify="flex-start" spacing={10}>
            <Grid item>                
              <CardHeader 
                title={conversationTitle===null || otherUser === null?'Lodading...':conversationTitle}
                subheader={lastActive}/>
              <CardContent>
                <Typography variant="body1" color="initial">
                  {'fromUserName: Message'}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>      
  );
}