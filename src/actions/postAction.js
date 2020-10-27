import axios from 'axios';
import {
  ADD_POST,
  ADD_POST_ERROR
} from './actionTypes';

import SERVER_URL from '../server-url';

export const addPost = (postData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  const postReqBody = JSON.stringify(postData);

  try {
    const postRes = await axios.post(`${SERVER_URL}/post/add`, postReqBody, config);
    dispatch({ type: ADD_POST });
    return postRes.data.url;
  } catch (error) {
    dispatch({ type: ADD_POST_ERROR });
    return '';
  }
}