import * as actionTypes from '../actions/actionTypes';
import getMe from '../../api/users/getMe';
import authenticate from '../../api/users/authenticate';
import getToken from '../../utills/getToken';
import setToken from '../../utills/setToken';
import removeToken from '../../utills/removeToken';

export const login = (user) => {
  return async (dispatch) => {
    dispatch(request());
    console.log('got login request');
    try{
      const token = await authenticate(user)
      console.log('action,auth, token:', token);
      if(token && token.error) throw ((token.error));
      dispatch(success(token));
    }
    catch(error) {
      console.log('////////failure, error:', error);
      dispatch(failure('email or password is incorrect!'));
    }    
  };

  function success(token) { return { type:actionTypes.LOGIN_SUCCESS, payload: {token:token} } }
  function request() {return {type: actionTypes.LOGIN_REQUEST}}
  function failure(error) { return {type:actionTypes.LOGIN_FAILURE, payload:{error:error}} }
}

export const checkTokenValidity = () => {
  return async (dispatch) => {
    dispatch(request());
    const token = getToken();
    if(!token) {
      removeToken();
      dispatch(failure('token absent'));
    }
    // if token present, check its validity
    getMe().then(user =>  {
      if(user && user.error){
        removeToken();
        dispatch(failure(user.error))
      }
      else{
        console.log('getMe, dispatching success, user:', user);
        dispatch(success(user, token));
      }
    }).catch(error => {
      removeToken();
      dispatch(failure(error));
    });
  }
  function request() { return { type:actionTypes.CHECK_TOKEN_VALIDITY_REQUEST } }
  function success(user, token) { return { type:actionTypes.CHECK_TOKEN_VALIDITY_SUCCESS, payload: {user: user, token: token} } }
  function failure(error) { return { type:actionTypes.CHECK_TOKEN_VALIDITY_FAILURE, payload: {error:error} } }
}

export const logout = () => {
  return async (dispatch) => {
    removeToken();
    dispatch(success());
  }
  function success() { return { type:actionTypes.LOGOUT_SUCCESS } }
}
