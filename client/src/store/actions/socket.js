import * as actionTypes from '../actions/actionTypes';
import setAndGetSocket from '../../api/socketIO/setAndGetSocket';
import * as actionCreators from '../actions/index';

export const setSocket = () => {
  return (dispatch, getState) => {
    dispatch(request());
    const state = getState();
    try{
      // console.log('state.auth.token.value:', state.authentication.token.value);
      const socket = setAndGetSocket(state.authentication.token.value);
      dispatch(success(socket));
    }
    catch(error) {
      dispatch(failure(error));
    }
  };

  function request() {
    return {
      type: actionTypes.SET_SOCKET_REQUEST
    }
  }
  function success(socket) {
    return {
      type: actionTypes.SET_SOCKET_SUCCESS,
      payload: {socket: socket}
    };
  }
  function failure(error) {
    return {
      type: actionTypes.SET_SOCKET_FAILURE,
      payload: {error:error},
    }
  }
}

export const handleSocketEvents = () => {
  return (dispatch, getState) => {
    const state = getState();
    const socket = state.socket.item;
    const userId = state.authentication.user._id;


    socket.onAny((event, ...args) => {
      console.log('onAny:', event, args);
    });

    socket.on('onlineUsers', (dataObj)=>{
      const onlineUsersIds = dataObj.onlineUserIds;
      onlineUsersIds.forEach((onlineUserId)=>{
        dispatch(actionCreators.userConnected(onlineUserId));
      });
    });


    // handle userBecameOnline
    socket.on('userBecameOnline', dataObj=>{
      console.log('...userconnected, dataObj:', dataObj);
      if(dataObj.from != userId)
        dispatch(actionCreators.userConnected(dataObj.from));
      else  console.log('getting request for self...');
    });

    // handle userBecameOffline
    socket.on('userBecameOffline', dataObj=>{
      console.log('...userDisconnected, dataObj:', dataObj);
      if(dataObj.from != userId) {
        dispatch(actionCreators.userDisconnected(dataObj));
      }
    });

    socket.on('gotNewMessage', dataObj => {
      const { message } = dataObj;
      console.log('gotNewMessage, message:', message);
      dispatch(actionCreators.addANewMessage(message.conversationId, message));
    });

    socket.on('newConversation', dataObj => {
      const {conversation} = dataObj;
      console.log('newConversation event, dataObj.conv:', dataObj.conversation);
      dispatch(actionCreators.addAConversation(conversation));
    });
  }
}

export const disconnectSocket = () => {
  return (dispatch, getState) => {
    try{
      const state = getState();
      const socket = state.socket.value;
      socket.disconnect();
    }
    catch(err) {
      console.log('error in disconnecting socket, err:', err);
    }
  }
}