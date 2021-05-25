import React, {useState, useEffect} from 'react';
import App from '../App';
import axios from 'axios';
import getAllUsers from '../api/users/getAllUsers';
import FeedItem from '../FeedItem/FeedItem';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default function FeedItemList(){
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [feedItems, setFeedItems] = useState();


  useEffect(()=>{
    getAllUsers().then((users)=>{
      if(users.length>0){
        let _feedItems = users.map((user,index)=>{
          return <FeedItem user={user} key={user._id} />
        });
        console.log('feedItemsInitialized');
        setFeedItems(_feedItems);
      }
      setIsLoading(false); 
    }).catch(err=>{
      console.log('getAllUsers-err: ',err)
      setIsLoading(false);
    });
    
  },[]);

  return(
    <Container maxWidth="lg" >
      <Grid>
        {isLoading?(<h5>Loading: FeedItemList</h5>):(!feedItems?<h5>null</h5>:feedItems)}
      </Grid>
    </Container>
  );
}