import React, {useState} from 'react';
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
import validator from 'validator';
import axios from 'axios';


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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function SignUp(props) {
  const classes = useStyles();
  
  const [isSignedUp, setIsSignedUp] = useState(false);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const [errorInFirstName, setErrorInFirstName] = useState(false);
  const [errorInLastName, setErrorInLastName] = useState(false);
  const [errorInEmail, setErrorInEmail] = useState(false);
  const [errorInPassword, setErrorInPassword] = useState(false);


  function signUpButtonClickedHandler(e){
    e.preventDefault();
    if(firstName==='' || email===''|| password===''){
      if(firstName===''){
        setErrorInFirstName(true);
      }
      if(email===''){
        setErrorInEmail(true)
      }
      if(password === ''){
        setErrorInPassword(true);
      }
      return;
    }
    // create a user Object
    const user = {
      firstName: firstName,
      email: email,
      password: password,
    }
    // send request to API
    axios.post('/api/users', user)
      .then(res => {
        console.log(res);
      }).catch(err=>{console.log(err)});
    // store response of API, if successfull response
    // send Response back to App.js

    // assume user registered
    props.signUpComplete();
  }
  
  function firstNameChangedHandler(e){
    if(validator.isAlpha(e.target.value) )  setErrorInFirstName(false);
    else  setErrorInFirstName(true);
    setFirstName(e.target.value);
  }

  function lastNameChangedHandler(e){
    if(validator.isAlpha(e.target.value) || e.target.value ==='')  setErrorInLastName(false);
    else  setErrorInLastName(true);
    setLastName(e.target.value);
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

  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} validate='true'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={errorInFirstName}
                onChange={(e)=>{firstNameChangedHandler(e)}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                error={errorInLastName}
                onChange={(e)=>lastNameChangedHandler(e)}   

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={errorInEmail}
                onChange={(e)=>emailChangedHandler(e)}  
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
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
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick= {(e)=> signUpButtonClickedHandler(e)}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={(e)=>props.haveAccountClick(e)}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}