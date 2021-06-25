import * as actionTypes from '../actions/actionTypes';
const initialState = {
  settingSocket: false,
  item: null,
  error: {
    valid: false,
    message: null,
    code: "NORMAL_ERROR"
  }
};

export function socket(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_SOCKET_SUCCESS:
      console.log('socket reducer: action:', action);
      return {
        ...state,
        settingSocket: false,
        error: {
          ...state.error,
          valid: false,
        },
        item: action.payload.socket,
      };
    case actionTypes.SET_SOCKET_REQUEST:
      return {
        ...state,
        settingSocket: true,
        error: {
          ...state.error,
          valid: false,
        },
      }
    case actionTypes.SET_SOCKET_FAILURE:
      return {
        ...state,
        error: {
          ...state.error,
          message: action.payload.error,
        }
      }
    default:
      return state;
  }
}