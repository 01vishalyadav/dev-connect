import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import * as actionCreators from './store/actions/index';

import Home from './components/Home/Home';
import SignInForm from './components/SignInForm/SignInForm';
import SignUpForm from './components/SignUpForm/SignUpForm';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state=>state.authentication.isLoggedIn);
  const token = useSelector(state=>state.authentication.token);
  const checkingTokenValidity = useSelector(state=>state.authentication.checkingTokenValidity);
  const showHome = useSelector(state=>state.authentication.showHome);

  const [haveAccount, setHaveAccount] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [signupCompleted, setSignupCompleted] = useState(false);

  const signUp = <SignUpForm signUpCompleted = {()=> setSignupCompleted(true)} 
                             haveAccountClicked={()=>haveAccountClickedHandler()} />
  const signIn = <SignInForm dontHaveAccountClicked={()=>dontHaveAccountClickedHandler()} />
  let form = signIn;

  useEffect(() => {
    if(signupCompleted||(!isLoggedIn && token.present)) {
      dispatch(actionCreators.checkTokenValidity());
    }
  },[isLoggedIn, token.present, signupCompleted]);

  useEffect(()=>{    
    if(isLoggedIn && token.present && token.valid===false) {
      console.log('calling dispatch for checkTokenValidity')
      dispatch(actionCreators.checkTokenValidity());
    }
  }, [isLoggedIn]);

  useEffect(()=>{
    if(checkingTokenValidity)
      setIsLoading(true);
    else
      setIsLoading(false);
  })



  useEffect(()=>{
    if(haveAccount){
      form = signIn;
    }
    else {
      form = signUp;
    }
  },[haveAccount]);

  function haveAccountClickedHandler() {
    setHaveAccount(true);
  }
  function dontHaveAccountClickedHandler(){
    setHaveAccount(false);
  }

  return (
    <Container maxWidth="lg">
      {
        isLoading ? <CircularProgress />
        :(showHome? <Home/>:(haveAccount?signIn:signUp))
      }
    </Container>
      
  );
}
