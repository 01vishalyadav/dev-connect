import React, {useState, useEffect} from 'react';
import validator from 'validator';
import axios from 'axios';

import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [errorInEmail, setErrorInEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [errorInPassword, setErrorInPassword] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(()=>{
    if(isSignedIn){
      props.signInCompleted();
    }
  });
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
    axios.post('/api/users/authentication', user)
      .then(res => {
        // send token to App.js that I am singedIn
        localStorage.setItem('x-auth-token',res.data);
        setIsSignedIn(true);
      }).catch( (err)=>{
        console.log("axios err:", err);
        console.log("err.res.data:",err.response.data);
        // show error that could not signedIn

        setSnackbarOpen(true);
        setErrorInEmail(true);
        setErrorInPassword(true);

      });
      // show error that could not signedIn
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
          Sign in
        </Typography>
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
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}