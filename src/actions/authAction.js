import axios from 'axios';
import {
  LOAD_USER,
  LOAD_USER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from './actionTypes';
import SERVER_URL from '../server-url';

export const loadUser = () => async dispatch => {
  try {
    const loadUserRes = await axios.get(`${SERVER_URL}/auth/check`, { withCredentials: true });

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
    await axios.post(`${SERVER_URL}/auth/login/local`, loginReqBody, config);
    dispatch({ type: LOGIN_SUCCESS });
    dispatch(loadUser());
  } catch (error) {
    if (error.response.status === 400) {
      dispatch({ type: LOGIN_FAIL });
    }
  }
}