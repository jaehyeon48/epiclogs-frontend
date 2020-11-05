import {
  ADD_POST,
  ADD_POST_ERROR,
  LOAD_PUBLIC_POSTS,
  LOAD_PUBLIC_POSTS_ERROR,
  TRIGGER_HOME_LOAD,
  REACHED_LAST
} from '../actions/actionTypes';

const initialState = {
  publicPosts: [],
  homePostLoading: true,
  reachedLast: false
};

export default function postReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case TRIGGER_HOME_LOAD:
      return {
        ...state,
        homePostLoading: true
      };
    case REACHED_LAST:
      return {
        ...state,
        reachedLast: true
      };
    case LOAD_PUBLIC_POSTS:
      return {
        ...state,
        publicPosts: [
          ...state.publicPosts,
          ...payload
        ],
        homePostLoading: false
      };
    case LOAD_PUBLIC_POSTS_ERROR:
      return {
        ...state,
        homePostLoading: false
      };
    case ADD_POST:
    case ADD_POST_ERROR:
    default:
      return state;
  }
}