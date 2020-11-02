import axios from 'axios';
import {
  LOAD_USER,
  LOAD_USER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAIL,
  LOGOUT,
  LOGOUT_FAIL
} from './actionTypes';
require('dotenv').config();

export const loadUser = () => async dispatch => {
  try {
    const loadUserRes = await axios.get(`${process.env.REACT_APP.SERVER_URL}/auth/check`, { withCredentials: true });

    dispatch({
      type: LOAD_USER,
      payload: loadUserRes.data
    })

  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL });
  }
}

export const login = (loginFormData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  const loginReqBody = JSON.stringify(loginFormData);

  try {
    await axios.post(`${process.env.REACT_APP.SERVER_URL}/auth/login/local`, loginReqBody, config);
    dispatch({ type: LOGIN_SUCCESS });
    dispatch(loadUser());
  } catch (error) {
    if (error.response.status === 400) {
      dispatch({ type: LOGIN_FAIL });
    }
  }
}

export const signUp = (signUpFormData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };
  const signUpReqBody = JSON.stringify(signUpFormData);
  try {
    await axios.post(`${process.env.REACT_APP.SERVER_URL}/auth/signup`, signUpReqBody, config);
    dispatch({ type: SIGN_UP_SUCCESS });
    dispatch(loadUser());
  } catch (error) {
    dispatch({ type: SIGN_UP_FAIL });
    console.error(error)
  }
}

export const registerNickname = (userId, nickname) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };
  const nicknameBody = JSON.stringify(userId, nickname);
  try {
    await axios.post(`${process.env.REACT_APP.SERVER_URL}/auth/register-nickname`, nicknameBody, config);
    dispatch({ type: SIGN_UP_SUCCESS });
    dispatch(loadUser());
  } catch (error) {
    dispatch({ type: SIGN_UP_FAIL });
    console.error(error)
  }
}

export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${process.env.REACT_APP.SERVER_URL}/auth/logout`, { withCredentials: true });
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.error(error);
    dispatch({ type: LOGOUT_FAIL });
  }
}