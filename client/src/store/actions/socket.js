import * as actionTypes from '../actions/actionTypes';
import setAndGetSocket from '../../api/socketIO/setAndGetSocket';
import * as actionCreators from '../actions/index';

export const setSocket = () => {
  return dispatch => {
    dispatch(request());
    try{
      const socket = setAndGetSocket();
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
    // mark me as connected in backend
    console.log('handleSocketEvents, emitting new User/////');
    socket.emit('new user', {userId: userId});
    // handle userBecameOffline
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
      dispatch(actionCreators.addNewMessage(message));
    });
  }
}