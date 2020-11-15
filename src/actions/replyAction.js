import axios from 'axios';
import {
  LOAD_REPLY,
  LOAD_REPLY_ERROR,
  ADD_REPLY,
  ADD_REPLY_ERROR
} from './actionTypes';

require('dotenv').config();

export const loadCommentReply = (commentId) => async (dispatch) => {
  try {
    const replyRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/reply/${commentId}`,
      { withCredentials: true });

    dispatch({ type: LOAD_REPLY });
    return replyRes.data;
  } catch (error) {
    console.error(error);
    dispatch({ type: LOAD_REPLY_ERROR });
  }
}

export const addReply = (replyText, commentId) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  const replyBody = JSON.stringify({ reply: replyText });
  try {
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/reply/${commentId}`, replyBody, config);
    dispatch({
      type: ADD_REPLY,
      payload: commentId
    });
  } catch (error) {
    console.error(error);
    dispatch({ type: ADD_REPLY_ERROR });
  }
}

export const loadReply = (commentId) => async (dispatch) => {

}