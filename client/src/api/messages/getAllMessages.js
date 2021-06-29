import axios from 'axios';

export default async function getAllMessages(conversationId, query=null){
  if(query=null) {
    query = {page:1, size: 1000};
  }
  const xAuthToken = localStorage.getItem('x-auth-token');
  if(!xAuthToken){
    const err = new Error('token is not present in localStorage');
    err.code='TOKEN_ABSENT';
    return err;
  }
  try{
    const response = await axios.get(`/api/conversations/${conversationId}/messages`, {
      headers: {'x-auth-token':xAuthToken}
    });
    const messages = response.data;
    return messages;
  }
  catch(err){
    return new Error(err);
  }
}