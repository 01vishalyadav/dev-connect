import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConversationItem from '../ConversationItem/ConversationItem';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

export default function ConversationItemList(props){
  const conversations = useSelector(state=>state.conversations);
  const users = useSelector(state => state.users);

  const [isLoading, setIsLoading] = useState(true);
  const [conversationItems, setConversationItems] = useState();

  
  function conversationItemClickedHandler(conversationId, conversationTitle, otherUser){
    // now hide conversationItemList and show messages for this conversation, to do so, return this signal to home, let it handle this
    // alert('conversationItem Clicked!');
    console.log('conItemList: got convId:', conversationId);
    console.log('clicked on conversation having otherUser:', otherUser)
    props.conversationItemClicked(conversationId, conversationTitle, otherUser);  
  }

  useEffect(()=> {
    console.log('users:', users);
  }, [users])

  useEffect(()=>{
    if(conversations.items) {
      console.log('//////conversations:', conversations);
      // in new build, check for empty here...
      if(conversations.items) {
        let _conversationItems = [];
        let conversationId;
        for(conversationId in conversations.items.byId) {
          console.log('convId:', conversationId);
          _conversationItems.push(
            <ConversationItem
              conversationId= {conversationId}
              key={conversationId}
              conversationItemClicked={(conversationId, conversationTitle, otherUser)=>conversationItemClickedHandler(conversationId, conversationTitle, otherUser)}
            />
          )
        }
        console.log('_conversationItemsInitialized');
        setConversationItems(_conversationItems);
        setIsLoading(false);
      }
    }
    if(conversations.error.valid)
      console.log('error in setting conversations:', conversations.error.message);

  },[conversations]);
    
  return(
    <Container maxWidth="lg" >
      <Grid>
        {isLoading?(<h5>Loading: ConversationItemList</h5>):(conversations.items.allIds.length===0 ? <h5>No Messages to Show</h5>:conversationItems)}
      </Grid>
    </Container>
  );
}