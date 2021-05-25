import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

export default function FeedItem(props){
  const {firstName, email} = props.user;
 
  return (    
    <Grid  container spacing={3}>
      <Grid  item xs={12} >
        <Card>
          <Grid container justify="flex-start" spacing={10}>
            <Grid item>                
              <CardHeader title={firstName}subheader={email}/>
              <CardContent>
                <Typography variant="body1" color="initial">
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>      
  );
}