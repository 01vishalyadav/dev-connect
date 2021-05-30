import axios from 'axios';

export default async function getMe(){
  const xAuthToken = localStorage.getItem('x-auth-token');
  if(!xAuthToken){
    const err = new Error('token is not present in localStorage');
    err.code='TOKEN_ABSENT';
    return err;
  }
  // try{
  //   const response = await axios.get('/api/users/me', {
  //     headers: {'x-auth-token':xAuthToken}
  //   });
  //   const user = response.data;
  //   console.log('getMe.js:- user:', user);
  //   return user;
  // }
  // catch(err){
  //   return new Error(err);
  // }
  axios.get('/api/users/me', {
    headers: {'x-auth-token': xAuthToken}
  }).then(response=>{
    return response.data;
  }).catch(err=>{
    if(err.response){
      console.log('getMe:- error.response:', err.response);
    }
    else if(err.request){
      console.log('getMe:- err.request:', err.request);
    }
    else{
      console.log('getMe:- something happened in setting up the request, err.message:', err.message);
    }
    return new Error(err);
  });
}