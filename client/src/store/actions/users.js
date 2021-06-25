import * as actionTypes from '../actions/actionTypes';
import getAUser from '../../api/users/getAUser';
import getAllUsers from '../../api/users/getAllUsers';


export const setUsers = () => {
  //make sure: conversations is set, authentication is set,
  return async (dispatch, getState) => {
    dispatch(request());

    getAllUsers().then(users=>{
      dispatch(success(users));
    }).catch(err=>{
      console.log('actions,users,setUsers,getAllusers err:',err);
      dispatch(failure(err));
    });
  };

  function request() {
    return {
      type: actionTypes.SET_USERS_REQUEST
    }
  }
  function success(users) {
    return {
      type: actionTypes.SET_USERS_SUCCESS,
      payload: {users:users}
    };
  }
  function failure(error) {
    return {
      type: actionTypes.SET_USERS_FAILURE,
      payload: {error:error},
    }
  }
}

export const userConnected = (userId) => {
  return (dispatch, getState) => {
    console.log('creating action for user connected for user:', userId);
    const state = getState();
    if(state.authentication.user._id != userId)
      dispatch(success(userId));
    else  console.log('getting request for self...');
  };
  function success(userId) {
    return {
      type: actionTypes.USER_CONNECTED,
      payload: {userId: userId}
    }
  }
}

export const userDisconnected = (dataObj) => {
  return (dispatch, getState) => {
    const state = getState();
    const {from, lastSeenAt} = dataObj;
    if(state.authentication.user._id == from){
      console.log('getting disconnecte request from self...');
      return;
    }
    console.log('creating action for user disconnected for user:', from);
    dispatch(success(dataObj));
  };
  function success(dataObj) {
    return {
      type: actionTypes.USER_DISCONNECTED,
      payload: {dataObj:{...dataObj}}
    }
  }
}