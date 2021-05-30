import axios from 'axios';

export default async function getAConversations(conversationId){
  const xAuthToken = localStorage.getItem('x-auth-token');
  if(!xAuthToken){
    const err = new Error('token is not present in localStorage');
    err.code='TOKEN_ABSENT';
    return err;
  }
  try{
    const response = await axios.get(`/api/conversations/${conversationId}`, {
      headers: {'x-auth-token':xAuthToken}
    });
    const conversation = response.data;
    return conversation;
  }
  catch(err){
    return new Error(err);
  }
}
