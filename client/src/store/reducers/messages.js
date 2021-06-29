import * as actionTypes from '../actions/actionTypes';
const initialState = {
  settingAllMessages: false,
  items: {
    byConversationId: {
      
    }
  },
  error: {
    valid: false,
    message: null,
    code: 'NORMAL_ERROR'
  }
};

export function messages(state = initialState, action) {
  switch(action.type) {
    case actionTypes.SET_MESSAGES_FOR_A_CONVERSATION_SUCCESS: {
      return {
        ...state,
        items: {
          ...state.items,
          byConversationId: {
            ...state.items.byConversationId,
            [action.payload.conversationId]: action.payload.allMessages,
          }
        }
      };
    }
    case actionTypes.SET_ALL_MESSAGES_FOR_THIS_USER_REQUEST: {
      return {
        ...state,
        settingAllMessages:true,
      };
    }
    case actionTypes.SET_ALL_MESSAGES_FOR_THIS_USER_SUCCESS: {
      return {
        ...state,
        settingAllMessages: false,
      }
    }
    case actionTypes.SET_ALL_MESSAGES_FOR_THIS_USER_FAILURE: {
      return {
        ...state,
        settingAllMessages: false,
        error: {
          ...state.error,
          valid: true,
          message: action.payload.error,
        }
      };
    }
    case actionTypes.ADD_A_NEW_MESSAGE_SUCCESS: {
      return {
        ...state,
        items: {
          ...state.items,
          byConversationId: {
            ...state.items.byConversationId,
            [action.payload.conversationId]: [...state.items.byConversationId[action.payload.conversationId], action.payload.newMessage]
          }
        }
      };
    }
    default:
      return state;
  }
}