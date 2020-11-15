import { combineReducers } from 'redux';

import auth from './authReducer';
import alert from './alertReducer';
import post from './postReducer';
import reply from './replyReducer';

export default combineReducers({
  auth,
  alert,
  post,
  reply
});