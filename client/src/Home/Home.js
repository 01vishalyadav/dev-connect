import React, {useState, useEffect} from 'react';
import axios from 'axios';
import FeedItemList from '../FeedItemList/FeedItemList';
import ConversationItemList from '../ConversationItemList/ConversationItemList';
import MessageItemList from '../MessageItemList/MessageItemList';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationIcon from '@material-ui/icons/Notifications';
import {red} from '@material-ui/core/colors';
import ChatIcon from '@material-ui/icons/Chat';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function hasValidToken(){
  const xAuthToken = localStorage.getItem('x-auth-token');
  if(xAuthToken === null)  {
    console.log('dont have token in localStorage');
    return false;
  }
  
  console.log('has token in localStorage');
  let valid = false;
  // present, but check if it is valid
  axios.get('/api/users/me',{
    headers: {
      'x-auth-token': xAuthToken,
    }
  })
  .then(res => {
    console.log('has valid token', res);
    valid = true;
  }).catch( (err)=>{
    console.log("axios err:", err);
    if(err.response){
      console.log('axios received4xx or 5xx');
    }
    else{
      console.log('axios dont know what went wrong');
    }
  });
  
  return valid;
}

export default function Home(props){
  const classes = useStyles();
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [email, setEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showFeedItemList, setShowFeedItemList] = useState(true);
  const [showConversationItemList, setShowConversationItemList] = useState(false);
  const [showMessageItemList, setShowMessageItemList]=useState(false);
  const [messageItemList, setMessageItemList] = useState(null);


  useEffect(()=>{
    if(!isLoggedIn){
      localStorage.removeItem('x-auth-token');
      props.logout();
    }
  });

  function chatIconClickedHandler(e){
    e.preventDefault();
    setShowFeedItemList(false);
    setShowConversationItemList(true);
  }
  function conversationItemClickedHandler(conversationId){
    // hide conversationItemList and show messageItemList for this conversationId

    setShowConversationItemList(false);
    setMessageItemList(<MessageItemList conversationId={conversationId} />)
    setShowMessageItemList(true);
  }

  return (
    <Container maxWidth="lg" >      
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Dev-Connect
          </Typography>
          <IconButton onClick={(e)=>chatIconClickedHandler(e)} >
            <ChatIcon style={{color:red[50]}} />
            {/* <NotificationIcon /> */}
          </IconButton>
          <Button color="inherit" onClick={()=>setIsLoggedIn(false)}>LOGOUT</Button>
        </Toolbar>
      </AppBar>
      
      
      <Container>
        {showFeedItemList && <FeedItemList/>}
        {showConversationItemList && <ConversationItemList userId={userId} conversationItemClicked={(conversationId)=>conversationItemClickedHandler(conversationId)} />}
        {showMessageItemList && messageItemList}
      </Container>
    </Container>
  );
}