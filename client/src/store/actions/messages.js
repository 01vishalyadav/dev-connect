import * as actionTypes from '../actions/actionTypes';
import * as actionCreators from '../actions/index';
import getAllMessages from '../../api/messages/getAllMessages';

export const setAllMessagesForThisUser = () => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(request());
    const conversationsById = state.conversations.items.byId;
    let n = 0;
    let resolvedCount = 0;
    for(let conversationId in conversationsById) {
      getAllMessages(conversationId).then(allMessages => {
        console.log('got all messages for convId...');
        dispatch(actionCreators.setMessagesForAConversation(conversationId, allMessages));
        ++ resolvedCount;
        if(resolvedCount == n) {
          dispatch(success());
        }
      }).catch(err => {
        console.log('error in getting messages for a conversation, err:',err);
        dispatch(failure(err));
      });
      n = n+1;
    }
  };

  function request() {
    return {
      type: actionTypes.SET_ALL_MESSAGES_FOR_THIS_USER_REQUEST
    }
  }
  function success() {
    return {
      type: actionTypes.SET_ALL_MESSAGES_FOR_THIS_USER_SUCCESS,
    };
  }
  function failure(error) {
    return {
      type: actionTypes.SET_ALL_MESSAGES_FOR_THIS_USER_FAILURE,
      payload: {error:error},
    }
  }
}

export const setMessagesForAConversation = (conversationId, allMessages) => {
  return (dispatch) => {
    dispatch(success(conversationId, allMessages));
  }
  function success(conversationId, allMessages) {
    return {
      type: actionTypes.SET_MESSAGES_FOR_A_CONVERSATION_SUCCESS,
      payload: {conversationId: conversationId, allMessages: allMessages}
    }
  }
}

export const addANewMessage = (conversationId, newMessage) => {
  return (dispatch) => {
    dispatch(success(conversationId, newMessage));
  }
  function success(conversationId, newMessage) {
    return {
      type: actionTypes.ADD_A_NEW_MESSAGE_SUCCESS,
      payload: {conversationId: conversationId, newMessage: newMessage}
    }
  }
}