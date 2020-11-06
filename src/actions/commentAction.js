import axios from 'axios';
import {
  ADD_COMMENT,
  ADD_COMMENT_ERROR
} from './actionTypes';
require('dotenv').config();

export const addComment = (postId, comment) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  try {
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const commentReqBody = JSON.stringify({ postId, comment, tzOffset });

    await axios.post(`${process.env.REACT_APP_SERVER_URL}/comment/add`,
      commentReqBody, config);
    dispatch({ type: ADD_COMMENT });
  } catch (error) {
    console.error(error);
    dispatch({ type: ADD_COMMENT_ERROR });
  }
}