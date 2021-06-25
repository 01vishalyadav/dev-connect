import { combineReducers } from 'redux';

import { authentication } from './authentication';
import {users} from './users';
import { conversations } from './conversations';
import { newMessages } from './newMessages';
import { socket } from './socket';

const rootReducer = combineReducers( {
  authentication,
  users,
  conversations,
  socket,
  newMessages,
});

export default rootReducer;