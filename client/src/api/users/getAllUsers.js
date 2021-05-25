
import axios from 'axios';

export default async function getAllUsers(){
  const xAuthToken = localStorage.getItem('x-auth-token');
  if(!xAuthToken){
    const err = new Error('token is not present in localStorage');
    err.code='TOKEN_ABSENT';
    return err;
  }
  try{
    const response = await axios.get('/api/users', {
      headers: {'x-auth-token':xAuthToken}
    });
    const users = response.data;
    return users;
  }
  catch(err){
    return new Error(err);
  }
}