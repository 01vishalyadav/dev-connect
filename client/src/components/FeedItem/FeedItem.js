import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import MessageIcon from '@material-ui/icons/Message';


export default function FeedItem(props){
  // props.user is the user for which this FeedItem is created
  const {firstName, lastName, email, githubId, publicReposCount} = props.user;
  function messageIconClickedHandler(e) {
    // create a new conversation with this user, if there is not any one to one conversation having these two as participants
    // show MessageItemList
    // let these handle by home.js, because it will have thisUserId
    props.messageIconClicked(props.user);
  }
 
  return (    
    <Grid  container spacing={3}>
      <Grid  item xs={12} >
        <Card>
          <Grid container justify="flex-start" spacing={10}>
            <Grid item>                
              <CardHeader 
                title={`${githubId} ${firstName && firstName != ""? "(" + firstName + (lastName && lastName != "" ? " " + lastName : "") + ")" : ""} `}
                subheader={`Public Repos Count: ${publicReposCount}`}
              />
              <CardContent>
                <Typography variant="body1" color="initial">
                  {email ? `email: ${email}` : ``}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton area-label="message to user" onClick={e=>messageIconClickedHandler(e)}>
                  <MessageIcon />
                </IconButton>
              </CardActions>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>      
  );
}