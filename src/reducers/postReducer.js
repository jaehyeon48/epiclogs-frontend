import {
  ADD_POST,
  ADD_POST_ERROR,
  EDIT_POST,
  EDIT_POST_ERROR,
  LOAD_PUBLIC_POSTS,
  LOAD_PUBLIC_POSTS_ERROR,
  LOAD_MY_POSTS,
  LOAD_MY_POSTS_ERROR,
  TRIGGER_HOME_LOAD,
  TRIGGER_MYPOST_LOAD,
  HOME_REACHED_LAST,
  MYPOST_REACHED_LAST
} from '../actions/actionTypes';

const initialState = {
  publicPosts: [],
  myPosts: [],
  homePostLoading: true,
  myPostLoading: true,
  homeReachedLast: false,
  myPostReachedLast: false,
  shouldReloadHome: false,
  shouldReloadMyPost: false
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
    case TRIGGER_MYPOST_LOAD:
      return {
        ...state,
        myPostLoading: true
      };
    case HOME_REACHED_LAST:
      return {
        ...state,
        homeReachedLast: true
      };
    case MYPOST_REACHED_LAST:
      return {
        ...state,
        myPostReachedLast: true
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
    case LOAD_MY_POSTS:
      return {
        ...state,
        myPosts: [
          ...state.myPosts,
          ...payload
        ],
        myPostLoading: false,
        shouldReloadMyPost: false
      };
    case LOAD_MY_POSTS_ERROR:
      return {
        ...state,
        myPostLoading: false,
        shouldReloadMyPost: false
      };
    case ADD_POST:
    case EDIT_POST:
      return {
        ...state,
        homePostLoading: true,
        myPostLoading: true,
        shouldReloadHome: true,
        shouldReloadMyPost: true
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