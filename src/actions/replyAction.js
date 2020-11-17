import axios from 'axios';
import {
  LOAD_REPLIES,
  LOAD_REPLIES_ERROR,
  LOAD_A_REPLY,
  LOAD_A_REPLY_ERROR,
  ADD_REPLY,
  ADD_REPLY_ERROR,
  EDIT_REPLY,
  EDIT_REPLY_ERROR
} from './actionTypes';

require('dotenv').config();

// load replies of a comment
export const loadCommentReply = (commentId) => async (dispatch) => {
  try {
    const replyRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/reply/${commentId}`,
      { withCredentials: true });

    dispatch({ type: LOAD_REPLIES });
    return replyRes.data;
  } catch (error) {
    console.error(error);
    dispatch({ type: LOAD_REPLIES_ERROR });
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

export const editReply = (replyText, replyId) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  const replyBody = JSON.stringify({ reply: replyText });
  try {
    await axios.put(`${process.env.REACT_APP_SERVER_URL}/reply/${replyId}`, replyBody, config);
    dispatch({
      type: EDIT_REPLY,
      payload: replyId
    });
    console.log(replyId)
  } catch (error) {
    console.error(error);
    dispatch({ type: EDIT_REPLY_ERROR });
  }
}

// load a reply
export const loadReply = (replyId) => async (dispatch) => {
  try {
    const replyRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/reply/one/${replyId}`,
      { withCredentials: true });

    dispatch({ type: LOAD_A_REPLY });
    return replyRes.data;
  } catch (error) {
    console.error(error);
    dispatch({ type: LOAD_A_REPLY_ERROR });
  }
}