import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isLoggedIn:false,
  user: null,
  token: {
    valid: false,
    present: true,
    value: null,
  },
  loggingIn: false,
  checkingTokenValidity: false,
  showHome: false,
  error: {
    valid: false,
    message: null,
    code: "NORMAL_ERROR"
  }
};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      console.log('login success reducer:', action);
      return {
        ...state,
        isLoggedIn: true,
        loggingIn: false,
        error: {
          ...state.error,
          valid: false,
        },
        token: {
          ...state.token,
          valid: false,
          value: action.payload.token,
          present: true,
        }
      };
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isLoggedIn: false,
        error: {
          ...state.error,
          valid: false,
        },
        showHome: false,
        loggingIn: true
      };
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        loggingIn: false,
        showHome: false,
        error: {
          ...state.error,
          valid: true,
          message: action.payload.error
        }
      };
    

    case actionTypes.CHECK_TOKEN_VALIDITY_REQUEST: {
      return {
        ...state,
        checkingTokenValidity: true,
        showHome: false,
      }
    }

    case actionTypes.CHECK_TOKEN_VALIDITY_SUCCESS: {
      console.log('setting state.user to:', action.payload.user);
      return {
        ...state,
        checkingTokenValidity: false,
        isLoggedIn: true,
        showHome:true,
        token: {
          ...state.token,
          value: action.payload.token,
          valid: true,
          present: true,
        },
        user: action.payload.user,
      }
    }

    case actionTypes.CHECK_TOKEN_VALIDITY_FAILURE: {
      return {
        ...state,
        isLoggedIn: false,
        checkingTokenValidity: false,
        showHome: false,
        token: {
          ...state.token,
          valid: false,
          present: false,
        }
      }
    }

    case actionTypes.LOGOUT_SUCCESS: {
      return {
        ...state,
        isLoggedIn: false,
        showHome:false,
        token: {
          ...state.token,
          valid: false,
          present: false,
          value: null,
        }
      }
    }

    default:
      return state;
  }
}