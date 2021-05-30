import axios from 'axios';

export default async function createAConversation(otherUserId){
  console.log('got a otherUserId:', otherUserId);
  const xAuthToken = localStorage.getItem('x-auth-token');
  if(!xAuthToken){
    const err = new Error('token is not present in localStorage');
    err.code='TOKEN_ABSENT';
    return err;
  }
  try{
    const response = await axios.post(`/api/conversations`, 
      {'otherUserId':otherUserId},
      {
        headers: {'x-auth-token':xAuthToken}
      }       
    );
    const conversation = response.data;
    return conversation;
  }
  catch(err){
    return new Error('error in creating/getting a convresation,err:', err);
  }
}
