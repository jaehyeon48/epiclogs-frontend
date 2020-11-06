import {
  ADD_COMMENT,
  ADD_COMMENT_ERROR
} from '../actions/actionTypes';

const initialState = {

};

export default function commentReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_COMMENT:
    case ADD_COMMENT_ERROR:
    default:
      return state;
  }
}