import {
  ADD_POST,
  ADD_POST_ERROR
} from './actionTypes';

export const addPost = (postData) => async (dispatch) => {
  const { title, tag, postBody, privacy } = postData;
  console.log(title);
  console.log(tag);
  console.log(postBody);
  console.log(privacy);
}