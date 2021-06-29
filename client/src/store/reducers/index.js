import { combineReducers } from 'redux';

import { authentication } from './authentication';
import {users} from './users';
import { conversations } from './conversations';
import { messages } from './messages';
import { socket } from './socket';

const rootReducer = combineReducers( {
  authentication,
  users,
  conversations,
  socket,
  messages,
});

export default rootReducer;