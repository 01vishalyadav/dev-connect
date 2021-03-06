import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import getAllUsers from '../../api/users/getAllUsers';
import FeedItem from '../FeedItem/FeedItem';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function FeedItemList(props){
  const user = useSelector(state => state.authentication.user);
  const [isLoading, setIsLoading] = useState(true);
  const [feedItems, setFeedItems] = useState();
  function messageIconClickedHandler(otherUser){
    props.feedItemMessageIconClicked(otherUser);
  }

  useEffect(() => {
    getAllUsers().then((users)=>{
      if(users.length>0){
        // exclude the current user using filter
        let _feedItems = users
          .filter(otherUser=> otherUser._id !== user._id)
          .map((otherUser,index)=>{
          return <FeedItem 
                  user={otherUser}
                  key={otherUser._id} 
                  messageIconClicked={(otherUser)=> messageIconClickedHandler(otherUser)} />
        });
        // console.log('feedItemsInitialized');
        // console.log('got user from store: ', storeUser);
        setFeedItems(_feedItems);
      }
      setIsLoading(false); 
    }).catch(err=>{
      console.log('getAllUsers-err: ',err)
      setIsLoading(false);
    });
    
  },[]);
  // console.log('storeUser:', storeUser);
  return(
    <Container maxWidth="lg" >
      <Grid>
        {isLoading?(<CircularProgress />):(!feedItems?<h5>There is not any user to show!</h5>:feedItems)}
      </Grid>
    </Container>
  );
}