import React from 'react';
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
  console.log('convItem: otherUserId:', otherUserId);
  
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
                title={otherUser.firstName}
                subheader={'not set'}/>
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