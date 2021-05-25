import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';


export default function ConversationItem(props){
  const {participants, lastActive, _id} = props.conversation;
  const userId = props.userId;
  const withUserId = userId == participants[0] ? participants[0] : participants[1];  

  function conversationItemClickedHandler(){
    console.log('conversationItem clicked with convId:', _id);
    props.conversationItemClicked(_id);
  }
 
  return (    
    <Grid  container spacing={3}  >
      <Grid  item xs={12} >
        <Card onClick={()=>conversationItemClickedHandler()}>
          <Grid container justify="flex-start" spacing={10}>
            <Grid item>                
              <CardHeader title={withUserId}subheader={lastActive}/>
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