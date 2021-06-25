import * as actionTypes from '../actions/actionTypes';
const initialState = {
  addingNewMessage: false,
  items:{
    byId:{},
    allIds:[]
  },
  error: {
    valid: false,
    message: null,
    code: "NORMAL_ERROR"
  }
};

export function newMessages(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_NEW_MESSAGE_SUCCESS: {
      const message = action.payload.newMessage;
      console.log('add new message success reducer, action:', action);
      return {
        ...state,
        items: {
          ...state.items,
          byId: {
            ...state.items.byId,
            [message._id]: message,
          },
          allIds: [
            ...state.items.allIds,
            message._id,
          ]
        },
        addingNewMessage: false,
        error: {
          ...state.error,
          valid: false
        }
      }
    }
    case actionTypes.ADD_NEW_MESSAGE_REQUEST: {
      return {
        ...state,
        addingNewMessage: true,
      }
    }
    case actionTypes.ADD_NEW_MESSAGE_FAILURE: {
      return {
        ...state,
        addingNewMessage: false,
        error: {
          ...state.error,
          valid: true,
          message: action.payload.error,
        }
      }
    }
    default:
      return state;
  }
}