import axios from 'axios';
export default async function authenticate(user) {
  try{
    const res = await axios.post('/api/users/authentication', user);
    const token = res.data;
    const temp = await localStorage.setItem('x-auth-token',token);
    return token;
  }
  catch(error) {
    return {
      error: error,
    };
  }
}