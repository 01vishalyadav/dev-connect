import * as actionTypes from '../actions/actionTypes';

export const addNewMessage = (newMessage) => {
  return async (dispatch, getState) => {
    dispatch(request());
    dispatch(success(newMessage));
  };

  function request() {
    return {
      type: actionTypes.ADD_NEW_MESSAGE_REQUEST,
    }
  }
  function success(newMessage) {
    return {
      type: actionTypes.ADD_NEW_MESSAGE_SUCCESS,
      payload: {newMessage:newMessage}
    };
  }
  function failure(error) {
    return {
      type: actionTypes.ADD_NEW_MESSAGE_FAILURE,
      payload: {error:error},
    }
  }
}
