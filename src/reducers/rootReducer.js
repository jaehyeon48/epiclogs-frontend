import { combineReducers } from 'redux';

import auth from './authReducer';
import alert from './alertReducer';
import post from './postReducer';

export default combineReducers({
  auth,
  alert,
  post
});