import {
  ADD_POST,
  ADD_POST_ERROR,
  EDIT_POST,
  EDIT_POST_ERROR,
  LOAD_PUBLIC_POSTS,
  LOAD_PUBLIC_POSTS_ERROR,
  TRIGGER_HOME_LOAD,
  REACHED_LAST
} from '../actions/actionTypes';

const initialState = {
  publicPosts: [],
  homePostLoading: true,
  reachedLast: false,
  shouldReloadHome: false
};

const postIdHashTable = {};

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
        publicPosts: removeDuplicatePost(state.publicPosts, payload),
        homePostLoading: false,
        shouldReloadHome: false
      };
    case LOAD_PUBLIC_POSTS_ERROR:
      return {
        ...state,
        homePostLoading: false
      };
    case ADD_POST:
    case EDIT_POST:
      return {
        ...state,
        homePostLoading: true,
        shouldReloadHome: true
      }
    case ADD_POST_ERROR:
    case EDIT_POST_ERROR:
    default:
      return state;
  }
}

const removeDuplicatePost = (prevPosts, newPosts) => {
  const result = [...prevPosts];

  for (const newPost of newPosts) {
    if (!postIdHashTable[newPost.postId]) { // if the postId already exists, skip
      postIdHashTable[newPost.postId] = true;
      result.push(newPost);
    }
  };
  return result;
}