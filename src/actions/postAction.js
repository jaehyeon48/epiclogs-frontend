import axios from 'axios';
import {
  ADD_POST,
  ADD_POST_ERROR,
  EDIT_POST,
  EDIT_POST_ERROR,
  LOAD_PUBLIC_POSTS,
  LOAD_PUBLIC_POSTS_ERROR,
  TRIGGER_HOME_LOAD,
  TRIGGER_MYPOST_LOAD,
  HOME_REACHED_LAST,
  MYPOST_REACHED_LAST,
  LOAD_MY_POSTS_ERROR,
  LOAD_MY_POSTS
} from './actionTypes';

require('dotenv').config();

export const addPost = (postData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  const tzOffset = (new Date()).getTimezoneOffset() * 60000;
  const postReqBody = JSON.stringify({ ...postData, tzOffset });

  try {
    const postRes = await axios.post(`${process.env.REACT_APP_SERVER_URL}/post/add`, postReqBody, config);
    dispatch({ type: ADD_POST });
    return postRes.data.url;
  } catch (error) {
    dispatch({ type: ADD_POST_ERROR });
    return '';
  }
}

export const editPost = () => (dispatch) => {
  dispatch({ type: EDIT_POST });
}

export const editPostError = () => (dispatch) => {
  dispatch({ type: EDIT_POST_ERROR });
}

export const loadPublicPosts = (startRange) => async (dispatch) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/all/${startRange}`);
    if (res.data.didReachedLast) {
      dispatch({ type: HOME_REACHED_LAST });
    }
    dispatch({
      type: LOAD_PUBLIC_POSTS,
      payload: res.data.post
    });
  } catch (error) {
    dispatch({ type: LOAD_PUBLIC_POSTS_ERROR });
  }
}

export const triggerLoadHomePost = () => (dispatch) => {
  dispatch({ type: TRIGGER_HOME_LOAD });
}

export const triggerLoadMyPost = () => (dispatch) => {
  dispatch({ type: TRIGGER_MYPOST_LOAD });
}

export const loadMyPosts = (startRange) => async (dispatch) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/user/${startRange}`,
      { withCredentials: true });
    if (res.data.didReachedLast) {
      dispatch({ type: MYPOST_REACHED_LAST });
    }
    dispatch({
      type: LOAD_MY_POSTS,
      payload: res.data.post
    });
  } catch (error) {
    dispatch({ type: LOAD_MY_POSTS_ERROR });
  }
}