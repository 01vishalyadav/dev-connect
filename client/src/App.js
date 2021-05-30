import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Home from './Home/Home';
import SignInForm from './SignInForm/SignInForm';
import SignUpForm from './SignUpForm/SignUpForm';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [haveAccount, setHaveAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState();

  const signUp = <SignUpForm signUpCompleted = {()=> signUpCompletedHandler()} haveAccountClicked={()=>haveAccountClickedHandler()} />
  const signIn = <SignInForm signInCompleted = {()=> signInCompletedHandler() } dontHaveAccountClicked={()=>dontHaveAccountClickedHandler()} />
  let form = signUp;

  function checkIfAlreadyLoggedIn(){
    if(!isLoggedIn){
      setIsLoading(true);
      const xAuthToken = localStorage.getItem('x-auth-token');
      if(xAuthToken === null)  {
        console.log('dont have token in localStorage');
        setIsLoading(false);
      }
      else{
        console.log('has token in localStorage');
        let valid = false;
        // present, but check if it is valid
        axios.get('/api/users/me',{
          headers: {
            'x-auth-token': xAuthToken,
          }
        })
        .then(res => {
          console.log('has valid token', res);
          setUser(res.data);
          setIsLoggedIn(true);
          setIsLoading(false);          
        }).catch( (err)=>{
          console.log("axios err:", err);
          if(err.response){
            console.log('axios received 4xx or 5xx');
            console.log('rmoving token from localStorage');
            localStorage.removeItem('x-auth-token');
            setIsLoggedIn(false);
            setIsLoading(false);   
          }
          else{
            console.log('axios dont know what went wrong');
            setIsLoggedIn(false);
            setIsLoading(false);   
          }
        });
      }
    }
  }

  useEffect(()=>{
    if(!isLoggedIn){
      checkIfAlreadyLoggedIn();
      if(haveAccount){
        form = signIn;
      }
    }
  },[]);

  function signUpCompletedHandler() {
    checkIfAlreadyLoggedIn();
  }
  function signInCompletedHandler() {
    checkIfAlreadyLoggedIn();
  }
  function haveAccountClickedHandler() {
    setHaveAccount(true);
  }
  function dontHaveAccountClickedHandler(){
    setHaveAccount(false);
  }

  function logout() {
    localStorage.removeItem('x-auth-token');
    setIsLoggedIn(false);
  }

  return (
    <Container maxWidth="lg">
      {
        isLoading ? (<CircularProgress />)
        :(isLoggedIn ? (<Home logout={()=>logout()} user={user} />):(haveAccount?signIn:signUp))
      }
    </Container>
  );
}
