import {
  ADD_POST,
  ADD_POST_ERROR
} from '../actions/actionTypes';

const initialState = {

};

export default function postReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_POST:
    case ADD_POST_ERROR:
    default:
      return state;
  }
}