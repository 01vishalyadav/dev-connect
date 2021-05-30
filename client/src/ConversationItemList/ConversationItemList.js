import React, {useState, useEffect} from 'react';
import getAllConversations from '../api/Conversations/getAllConversations';
import ConversationItem from '../ConversationItem/ConversationItem';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

export default function ConversationItemList(props){
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [conversationItems, setConversationItems] = useState();
  let userId=props.userId;
  let conversations = [];
  console.log('ConversationItemList.js:- props.user:', props.user);

  function conversationItemClickedHandler(conversationId, conversationTitle, otherUser){
    // now hide conversationItemList and show messages for this conversation, to do so, return this signal to home, let it handle this
    // alert('conversationItem Clicked!');
    console.log('conItemList: got convId:', conversationId);
    console.log('clicked on conversation having otherUser:', otherUser)
    props.conversationItemClicked(conversationId, conversationTitle, otherUser);  
  }

  useEffect(()=>{
    getAllConversations().then((conversations)=>{
      if(conversations.length>0){
        let _conversationItems = conversations.map((conversation,index)=>{
          return <ConversationItem 
                  conversation={conversation} 
                  key={conversation._id}
                  user={props.user} 
                  conversationItemClicked={(conversationId, conversationTitle, otherUser)=>conversationItemClickedHandler(conversationId, conversationTitle, otherUser)}

                />
        });
        console.log('_conversationItemsInitialized');
        setConversationItems(_conversationItems);
      }
    }).catch(err=>console.log("axios err:", err))
      .finally(()=>setIsLoading(false));
  },[]);

  return(
    <Container maxWidth="lg" >
      <Grid>
        {isLoading?(<h5>Loading: ConversationItemList</h5>):(!conversationItems?<h5>null</h5>:conversationItems)}
      </Grid>
    </Container>
  );
}