import {
  LOAD_REPLY,
  LOAD_REPLY_ERROR,
  ADD_REPLY,
  ADD_REPLY_ERROR
} from '../actions/actionTypes';

const initialState = {
  reloadReply: false,
  reloadReplyComment: null // commentId of newly added reply
};

export default function replyReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_REPLY:
      return {
        ...state,
        reloadReply: false,
        reloadReplyComment: null
      };
    case ADD_REPLY:
      return {
        ...state,
        reloadReply: true,
        reloadReplyComment: payload
      };
    default:
      return state;
  }
}