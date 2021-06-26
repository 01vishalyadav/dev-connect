import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import createAConversation from '../../api/Conversations/createAConversation';
import MessageItemList from '../MessageItemList/MessageItemList';
import FeedItemList from '../FeedItemList/FeedItemList';
import ConversationItemList from '../ConversationItemList/ConversationItemList';
import PropTypes from 'prop-types';
import { AppBar, CssBaseline, Divider, Drawer, Hidden, 
          IconButton, List, ListItem, ListItemIcon, 
          ListItemText, Toolbar, Typography, Container,
          Badge, 
       }  from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
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
  const dispatch = useDispatch();
  const user = useSelector(state=> state.authentication.user);
  const socket = useSelector(state => state.socket);
  const newMessagesCount = useSelector(state=> state.newMessages.items.allIds.length);


  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showFeedItemList, setShowFeedItemList] = useState(false);
  const [showConversationItemList, setShowConversationItemList] = useState(false);
  const [showMessageItemList, setShowMessageItemList]=useState(false);
  const [messageItemList, setMessageItemList] = useState(null);


  useEffect(() => {
    console.log('inHOmeUseEffect///////');
    dispatch(actionCreators.setSocket());
    dispatch(actionCreators.setConversations());
    //setUsers which are in conversation with this user
    // currently, setting all users...
    dispatch(actionCreators.setUsers());
  },[]);

  useEffect(() => {
    if(socket && socket.item){
      function setMeAsConnected () {
        dispatch(actionCreators.handleSocketEvents());
        setShowFeedItemList(true);
      }
      setMeAsConnected();
    }
  }, [socket]);

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
                        otherUserId={otherUser._id}
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
    createAConversation(otherUser._id).then(conversation => {
      console.log('conversation/////', conversation);
      dispatch(actionCreators.addAConversation(conversation));
      // get conversation title
      // console.log('got conv:',conversation);
      // console.log('socket:',socket);
      setMessageItemList(<MessageItemList 
                          conversationId={conversation._id}
                          otherUserId={otherUser._id}
                        />);
      setShowMessageItemList(true);
    }).catch(err=>{
      return console.log('something went wrong in creating/getting conversation, err:',err);
    })
  }

  function logoutIconClickedHandler(e){
    dispatch(actionCreators.logout());
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
        <ListItem button 
                  key={"conversationItemList"} 
                  onClick={(e)=>chatIconClickedHandler(e)}>
          <ListItemIcon>
          <Badge badgeContent={newMessagesCount} color="primary" max={99}>
            <ChatIcon />
          </Badge>
          </ListItemIcon>
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
        
        {showFeedItemList && <FeedItemList
                                            user = {user}
                                            feedItemMessageIconClicked={(otherUser)=>feedItemMessageIconClickedHandler(otherUser)}
                                            />
        }
        { showConversationItemList && <ConversationItemList conversationItemClicked={(conversationId, conversationTitle, otherUser)=>conversationItemClickedHandler(conversationId, conversationTitle, otherUser)} />}
        { socket!==null && showMessageItemList && messageItemList}
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
