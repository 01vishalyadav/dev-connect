import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import validator from 'validator';
import queryString from 'query-string';

import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="localhost:3000">
        Dev-Connect
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const dispatch = useDispatch();
  const authentication = useSelector(state=>state.authentication);

  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [errorInEmail, setErrorInEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [errorInPassword, setErrorInPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [code, setCode] = useState(queryString.parse(window.location.search).code);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthEnabled, setIsOAuthEnabled] = useState(true);
  const [githubOAuthLink, setGithubOAuthLink] = useState("")
  useEffect(()=>{
    const devLink = "https://github.com/login/oauth/authorize?client_id=cbea6799c7a92cf8030b";
    const prodLink = "https://github.com/login/oauth/authorize?client_id=b6c57bc0f8bedf1f53a3"

    if(process.env.NODE_ENV && process.env.NODE_ENV === "production") {
      setGithubOAuthLink(prodLink)
    }
    else {
      setGithubOAuthLink(devLink);
    }
  },[])
  
  useEffect(() => {
    if(authentication.error.valid) {
      setSnackbarOpen(true);
      setErrorInEmail(true);
      setErrorInPassword(true);
    }
  }, [authentication]);

  useEffect(() => {
    console.log("React env:", process.env.NODE_ENV);
    if(code && code != ""){
      console.log("code =", code);
      const user = {code: code};
      setIsLoading(true);
      dispatch(actionCreators.login(user));
    }
  }, [code]);

  useEffect(()=> {
    console.log('signInForm, isLoading', isLoading);
  },[isLoading]);


  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  function signInButtonClickedHandler(e){
    e.preventDefault();
    if(email===''|| password===''){
      if(email===''){
        setErrorInEmail(true)
      }
      if(password === ''){
        setErrorInPassword(true);
      }
      return;
    }
    // create a user Object based on input by user
    const user = {
      email: email,
      password: password,
    }
    // send request to API for authentication of this user
    dispatch(actionCreators.login(user));
  }
  function emailChangedHandler(e){
    if(validator.isEmail(e.target.value) )  setErrorInEmail(false);
    else  setErrorInEmail(true);
    setEmail(e.target.value)
  }

  function passwordChangedHandler(e){
    if(e.target.value !== ''){
      setErrorInPassword(false);
    }
    else  setErrorInPassword(true);
    setPassword(e.target.value);
  }

  function dontHaveAccountClickedHandler(e) {
    e.preventDefault();
    props.dontHaveAccountClicked();
  }

  return (
    isLoading ? <CircularProgress /> :
    <Container component="main" maxWidth="xs">
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{vertical:'top',horizontal:'center'}}>
        <Alert onClose={handleSnackbarClose} 
          severity="error">
          Email or Password is incorrect
        </Alert>
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in using
        </Typography>
        {
          isOAuthEnabled
          ?
          <Grid Container>
            <IconButton 
              aria-label="GitHub" 
              href={githubOAuthLink}>
              <GitHubIcon 
                fontSize="large"
              />
            </IconButton>
          </Grid>
          :
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              error={errorInEmail}
              onChange={(e)=>emailChangedHandler(e)}  
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={errorInPassword}
              onChange={(e)=>passwordChangedHandler(e)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick= {(e)=> signInButtonClickedHandler(e)}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2" onClick={(e)=>dontHaveAccountClickedHandler(e)}>
                  {"Don't have an account? Sign Up"}
                </Link>
                
              </Grid>
            </Grid>
          </form>
        }
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}