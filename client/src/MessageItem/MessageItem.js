import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import {red} from '@material-ui/core/colors';

import CardHeader from '@material-ui/core/CardHeader';
import {CardContent,List,ListItem,ListItemText} from '@material-ui/core';

export default function MessageItem(props){
  const {from, content, _id, conversationId, createdAt, status} = props.message;
  const userId = props.user._id;
  
  return (    
      <ListItem divider>
        <ListItemText
          primary={content}
          secondary={createdAt}
          style={{textAlign:userId==from?"right":"left"}}
        />
      </ListItem>
  );
}