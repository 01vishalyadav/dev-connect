import * as actionTypes from '../actions/actionTypes';
import getAllConversations from '../../api/Conversations/getAllConversations';

export const setConversations = () => {
  return dispatch => {
    dispatch(request());

    getAllConversations().then(conversations=>{
      console.log('setConversations: dispatching:', conversations);
      dispatch(success(conversations));
    }).catch(err=> failure(err))
  };

  function request() {
    return {
      type: actionTypes.SET_CONVERSATIONS_REQUEST
    }
  }
  function success(conversations) {
    return {
      type: actionTypes.SET_CONVERSATIONS_SUCCESS,
      payload: {conversations:conversations}
    };
  }
  function failure(error) {
    return {
      type: actionTypes.SET_CONVERSATIONS_FAILURE,
      payload: {error:error},
    }
  }
}

export const addAConversation = (conversation) => {
  return dispatch => {
    dispatch(success(conversation));
  };
  
  function success(conversation) {
    return {
      type: actionTypes.ADD_A_CONVERSATION,
      payload: {conversation:conversation}
    };
  }
}