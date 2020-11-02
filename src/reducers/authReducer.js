import {
  LOAD_USER,
  LOAD_USER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAIL,
  LOGOUT,
  LOGOUT_FAIL
} from '../actions/actionTypes'

const initialState = {
  authLoading: true,
  isAuthenticated: false,
  user: {}
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_USER:
      return {
        ...state,
        authLoading: false,
        isAuthenticated: true,
        user: payload
      };
    case LOAD_USER_FAIL:
      return {
        ...state,
        authLoading: false,
        user: {}
      };
    case LOGIN_SUCCESS:
    case SIGN_UP_SUCCESS:
      // reload the page cause the password is exposed on browser devtools
      window.location.reload();
      return {
        ...state,
        authLoading: false,
        isAuthenticated: true
      };
    case LOGIN_FAIL:
    case SIGN_UP_FAIL:
      return {
        ...state,
        authLoading: false,
        isAuthenticated: false,
        user: {}
      };
    case LOGOUT:
      return {
        authLoading: false,
        isAuthenticated: false,
        user: {}
      };
    case LOGOUT_FAIL:
    default:
      return state;
  }
}