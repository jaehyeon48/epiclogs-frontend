import {
  LOAD_USER,
  LOAD_USER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAIL,
  LOGOUT,
  LOGOUT_FAIL,
  UPLOAD_AVATAR,
  UPLOAD_AVATAR_FAIL,
  DELETE_AVATAR,
  DELETE_AVATAR_FAIL,
  MODIFY_USER_NAME,
  MODIFY_USER_NAME_FAIL,
  MODIFY_USER_NICKNAME,
  MODIFY_USER_NICKNAME_FAIL,
  MODIFY_PASSWORD,
  MODIFY_PASSWORD_FAIL
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
      // payload === history
      payload.goBack();
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
    case UPLOAD_AVATAR:
      return {
        ...state,
        user: {
          ...state.user,
          avatar: payload
        }
      };
    case DELETE_AVATAR:
      return {
        ...state,
        user: {
          ...state.user,
          avatar: ''
        }
      };
    case MODIFY_USER_NAME:
      return {
        ...state,
        user: {
          ...state.user,
          name: payload
        }
      };
    case MODIFY_USER_NICKNAME:
      return {
        ...state,
        user: {
          ...state.user,
          nickname: payload
        }
      };
    case MODIFY_PASSWORD:
    case LOGOUT_FAIL:
    case UPLOAD_AVATAR_FAIL:
    case DELETE_AVATAR_FAIL:
    case MODIFY_USER_NAME_FAIL:
    case MODIFY_USER_NICKNAME_FAIL:
    case MODIFY_PASSWORD_FAIL:
    default:
      return state;
  }
}