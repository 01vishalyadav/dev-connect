import * as actionTypes from '../actions/actionTypes';
const initialState = {
  settingUsers: false,
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

export function users(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_USERS_SUCCESS: {
      console.log('users reducer, SET_USERS_SUCCESS: action:', action);
      /*
      {
        items: {
          byId: {
            id1: user1,
            id2: user2
          }
          allIds: [id1, id2]
        }
      }
      */
      const byId = {...state.items.byId};
      const allIds = [...state.items.allIds];
      action.payload.users.forEach((user, index)=>  {
        byId[user._id] = user;
        allIds.push(user._id);
      });
      return {
        ...state,
        items: {
          ...state.items,
          byId: byId,
          allIds: allIds,
        },
        settingUsers: false,
      }
    }
    case actionTypes.SET_USERS_REQUEST: {
      return {
        ...state,
        settingUsers: true,
      }
    }
    case actionTypes.SET_USERS_FAILURE: {
      return {
        ...state,
        settingUsers: false,
        error: {
          ...state.error,
          valid: true,
          message: action.payload.error,
        }
      }
    }
    case actionTypes.USER_CONNECTED: {
      console.log('//////reducer////connected,state:', state);
      const userId = action.payload.userId;
      return {
        ...state,
        items: {
          ...state.items,
          byId: {
            ...state.items.byId,
            [userId]: {
              ...state.items.byId[userId],
              isConnected: true,
            }
          }
        }
      }
    }
    case actionTypes.USER_DISCONNECTED: {
      console.log('//////reducer////disconnected, dataObj:', action.payload.dataObj);
      const {from, lastSeenAt} = action.payload.dataObj;
      return {
        ...state,
        items: {
          ...state.items,
          byId: {
            ...state.items.byId,
            [from]: {
              ...state.items.byId[from],
              isConnected: false,
              lastSeenAt: lastSeenAt,
            }
          }
        }
      }
    }
    default:
      return state;
  }
}