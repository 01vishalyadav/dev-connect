import axios from 'axios';
export default async function authenticate(user) {
  try{
    let res;
    if(user.code) {
      res = await axios.get('/api/oauth/github/callback?code='+user.code);
    }
    else {
      res = await axios.post('/api/users/authentication', user);
    }
    const token = res.data;
    console.log('res.token =', token);
    const temp = await localStorage.setItem('x-auth-token',token);
    return token;
  }
  catch(error) {
    return {
      error: error,
    };
  }
}