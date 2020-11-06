import { combineReducers } from 'redux';

import auth from './authReducer';
import alert from './alertReducer';
import post from './postReducer';
import comment from './commentReducer';

export default combineReducers({
  auth,
  alert,
  post,
  comment
});