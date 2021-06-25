import * as actionTypes from '../actions/actionTypes';

const initialState = {
  settingConversations: false,
  items: {
    byId: {

    },
    allIds: [],
  },
  error: {
    valid: false,
    message: null,
    code: 'NORMAL_ERROR'
  }
};

export function conversations(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_CONVERSATIONS_SUCCESS:
      console.log('conversation reducer: action:', action);
      /*
      {
        items: {
          byId: {
            id1: conversationWithId1,
            id2: conversationWithId2
          }
          allIds: [id1, id2]
        }
      }
      */
      const byId = { ...state.items.byId };
      const allIds = [ ...state.items.allIds ];
      action.payload.conversations.forEach((conversation, index) => {
        byId[conversation._id] = conversation;
        allIds.push(conversation._id);
      });

      return {
        ...state,
        settingConversations: false,
        items: {
          ...state.items,
          byId:byId,
          allIds: allIds,
        },
        error: {
          ...state.error,
          valid: false
        }
      };
    case actionTypes.SET_CONVERSATIONS_REQUEST:
      return {
        ...state,
        settingConversations: true,
      }
    case actionTypes.SET_CONVERSATIONS_FAILURE:
      return {
        ...state,
        settingConversations: false,
        error: {
          ...state.error,
          valid: true,
          message: action.payload.error,
        }
      }
    case actionTypes.ADD_A_CONVERSATION: {
      return {
        ...state,
        items: {
          byId: {
            ...state.items.byId,
            [action.payload.conversation._id]: action.payload.conversation,
          },
          allIds: [...state.items.allIds, action.payload.conversation._id]
        }
      }
    }
    default:
      return state;
  }
}