import React, {useState, useEffect} from 'react';
import App from '../App';
import axios from 'axios';
import ConversationItem from '../ConversationItem/ConversationItem';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationIcon from '@material-ui/icons/Notifications';
import {red} from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';

export default function ConversationItemList(props){
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [conversationItems, setConversationItems] = useState();
  let userId=props.userId;
  let conversations = [];

  function conversationItemClickedHandler(conversationId){
    // now hide conversationItemList and show messages for this conversation, to do so, return this signal to home, let it handle this
    // alert('conversationItem Clicked!');
    console.log('conItemList: got convId:', conversationId);
    props.conversationItemClicked(conversationId);  
  }

  useEffect(()=>{
    const xAuthToken = localStorage.getItem('x-auth-token');
    if(xAuthToken === null)  {
      console.log('dont have token in localStorage');
      setIsLoading(false);
    }
    else{
      console.log('has token in localStorage');
      // present, but check if it is valid
      axios.get('/api/conversations',{
        headers: {
          'x-auth-token': xAuthToken,
        }
      })
      .then(res => {
        conversations = res.data;
        if(conversations.length>0){
          let _conversationItems = conversations.map((conversation,index)=>{
            return <ConversationItem conversation={conversation} key={conversation._id} userId={props.userId} conversationItemClicked={(conversationId)=>conversationItemClickedHandler(conversationId)} />
          });
          console.log('_conversationItemsInitialized');
          setConversationItems(_conversationItems);
        }
        // console.log('users::::', users);
        setIsLoading(false);          
      }).catch( (err)=>{
        console.log("axios err:", err);
        if(err.response){
          console.log('axios received 4xx or 5xx');
          setIsLoading(false);   
        }
        else{
          console.log('axios dont know what went wrong');
          setIsLoading(false);   
        }
      });
    }
  },[]);

  return(
    <Container maxWidth="lg" >
      <Grid>
        {isLoading?(<h5>Loading: ConversationItemList</h5>):(!conversationItems?<h5>null</h5>:conversationItems)}
      </Grid>
    </Container>
  );
}