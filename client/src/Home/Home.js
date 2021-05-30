import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import getMe from '../api/users/getMe';
import createAConversation from '../api/Conversations/createAConversation';
import MessageItemList from '../MessageItemList/MessageItemList';
import FeedItemList from '../FeedItemList/FeedItemList';
import ConversationItemList from '../ConversationItemList/ConversationItemList';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';import { Container } from '@material-ui/core';
import { set } from 'mongoose';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Home(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [isSignedIn, setIsSignedIn] = useState(true);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [email, setEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showFeedItemList, setShowFeedItemList] = useState(false);
  const [showConversationItemList, setShowConversationItemList] = useState(false);
  const [showMessageItemList, setShowMessageItemList]=useState(false);
  const [messageItemList, setMessageItemList] = useState(null);
  const [socket, setSocket] = useState(null);

  console.log('Home.js:- user:',props.user);

  useEffect(()=>{
    if(!isLoggedIn){
      getMe().then((me)=>{
        console.log('setting user');
        console.log('setting isLoggedIn');

        setIsLoggedIn(true);
      }).catch((err)=>{
        console.log('Home.js:- Error in getting me, err:', err);
        props.logout();
      })
    }
    if(isLoggedIn && socket===null){// if logged in...
      // connect to server using socket
      const socket = io(('/'),{
        auth: {
          token: 'token',
        }
      });
      socket.on('connect_error', (err) => {
        console.log(`could not connect to socket, err: ${err.message}`);
      });
      console.log('working');
      function setMeAsConnected (){
        console.log('setMeAsConnected initiated');
        const myUserId = props.user._id;
        socket.emit('new user', {userId: myUserId});
        console.log('setting socket: ',socket);
        setShowFeedItemList(true);
        setSocket(socket);
      }
      setMeAsConnected();
    }
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  function chatIconClickedHandler(e){
    e.preventDefault();
    setShowFeedItemList(false);
    setShowMessageItemList(false);
    setShowConversationItemList(true);
    if(mobileOpen)
      handleDrawerToggle();
  }

  function conversationItemClickedHandler(conversationId, conversationTitle, otherUser){
    // hide conversationItemList and show messageItemList for this conversationId
    setShowConversationItemList(false);
    setMessageItemList(<MessageItemList 
                        conversationId={conversationId} 
                        user={props.user}
                        conversationTitle={conversationTitle}
                        otherUser={otherUser}
                        socket={socket}
                      />)
    setShowMessageItemList(true);
  }

  function feedIconClickedHandler(e){
    setShowConversationItemList(false);
    setShowMessageItemList(false);
    setShowFeedItemList(true);
    if(mobileOpen)
      handleDrawerToggle();
  }

  function feedItemMessageIconClickedHandler(otherUser){
    setShowFeedItemList(false);
    // generate a new conversationId if not exist
    console.log('otherUsrId:', otherUser._id);
    createAConversation(otherUser._id).then(conversation=>{
      // get conversation title
      console.log('got conv:',conversation);
      console.log('socket:',socket);
      setMessageItemList(<MessageItemList 
                          conversationId={conversation._id} 
                          user={props.user}
                          conversationTitle={otherUser.firstName}
                          otherUser={otherUser}
                          socket={socket}
                        />);
      setShowMessageItemList(true);
    }).catch(err=>{
      return console.log('something went wrong in creating/getting conversation, err:',err);
    })
  }

  function logoutIconClickedHandler(e){
    props.logout();
  }

  const drawer = (
    <div>
      <Typography align="center" variant="h5" >Dev-Connect</Typography>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button key={"feedItemList"} onClick={(e)=>feedIconClickedHandler(e)} >
          <ListItemIcon><DynamicFeedIcon /></ListItemIcon>
          <ListItemText primary={"Feed"} />
        </ListItem>
        <ListItem button key={"conversationItemList"} onClick={(e)=>chatIconClickedHandler(e)}>
          <ListItemIcon><ChatIcon /></ListItemIcon>
          <ListItemText primary={"Messages"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key={"My Account"}>
          <ListItemIcon><AccountCircleIcon /></ListItemIcon>
          <ListItemText primary={"My Account"} />
        </ListItem>
        <ListItem button key={"conversationItemList"} onClick={(e)=>logoutIconClickedHandler(e)}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary={"Logout"} />
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Dev-Connect
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Container>
        
        {isLoggedIn && showFeedItemList && <FeedItemList 
                                            user={props.user}
                                            feedItemMessageIconClicked={(otherUser)=>feedItemMessageIconClickedHandler(otherUser)}
                                            />
        }
        {isLoggedIn && showConversationItemList && <ConversationItemList userId={userId} user={props.user}  conversationItemClicked={(conversationId, conversationTitle, otherUser)=>conversationItemClickedHandler(conversationId, conversationTitle, otherUser)} />}
        {isLoggedIn && socket!==null && showMessageItemList && messageItemList}
        </Container>
      </main>
    </div>
  );
}

Home.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
