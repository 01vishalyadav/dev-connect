import axios from 'axios';

export default async function getAllConversations(){
  const xAuthToken = localStorage.getItem('x-auth-token');
  if(!xAuthToken){
    const err = new Error('token is not present in localStorage');
    err.code='TOKEN_ABSENT';
    return err;
  }
  try{
    const response = await axios.get(`/api/conversations`, {
      headers: {'x-auth-token':xAuthToken}
    });
    const conversations = response.data;
    return conversations;
  }
  catch(err){
    return new Error(err);
  }
}
