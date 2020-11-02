import axios from 'axios';
import {
  ADD_POST,
  ADD_POST_ERROR
} from './actionTypes';

require('dotenv').config();

export const addPost = (postData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  const postReqBody = JSON.stringify(postData);

  try {
    const postRes = await axios.post(`${process.env.REACT_APP_SERVER_URL}/post/add`, postReqBody, config);
    dispatch({ type: ADD_POST });
    return postRes.data.url;
  } catch (error) {
    dispatch({ type: ADD_POST_ERROR });
    return '';
  }
}