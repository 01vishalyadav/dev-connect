import axios from 'axios';
export default async function getMe(){
  const xAuthToken = localStorage.getItem('x-auth-token');
  if(!xAuthToken){
    const err = new Error('token is not present in localStorage');
    err.code='TOKEN_ABSENT';
    return {error: err};
  }
  try{
    const response = await axios.get('/api/users/me', {
      headers: {'x-auth-token': xAuthToken}
    });
    return response.data;
  }
  catch(error) {
    return {error: error}
  }
}