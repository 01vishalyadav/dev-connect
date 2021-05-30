
import axios from 'axios';

export default async function getAUser(userId){
  const xAuthToken = localStorage.getItem('x-auth-token');
  if(!xAuthToken){
    const err = new Error('token is not present in localStorage');
    err.code='TOKEN_ABSENT';
    return err;
  }
  try{
    const response = await axios.get(`/api/users/${userId}`, {
      headers: {'x-auth-token':xAuthToken}
    });
    const user = response.data;
    return user;
  }
  catch(err){
    return new Error(err);
  }
}