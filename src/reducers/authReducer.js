import {
  LOAD_USER,
  LOAD_USER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from '../actions/actionTypes'

const initialState = {
  authLoading: true,
  isAuthenticated: false,
  user: null
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_USER:
      return {
        ...state,
        user: payload
      };
    case LOAD_USER_FAIL:
      return {
        ...state,
        user: {}
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        authLoading: false,
        isAuthenticated: true
      };
    case LOGIN_FAIL:
      return {
        ...state,
        authLoading: false,
        isAuthenticated: false,
        user: {}
      };
    default:
      return state;
  }
}