import {
  LOAD_REPLIES,
  LOAD_REPLIES_ERROR,
  LOAD_A_REPLY,
  LOAD_A_REPLY_ERROR,
  ADD_REPLY,
  ADD_REPLY_ERROR,
  EDIT_REPLY,
  EDIT_REPLY_ERROR
} from '../actions/actionTypes';

const initialState = {
  reloadComment: false,
  reloadCommentId: null, // commentId of newly added reply
  reloadReply: false,
  reloadReplyId: null
};

export default function replyReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_A_REPLY:
      return {
        ...state,
        reloadReply: false,
        reloadReplyId: null
      };
    case LOAD_REPLIES:
      return {
        ...state,
        reloadComment: false,
        reloadCommentId: null
      };
    case ADD_REPLY:
      return {
        ...state,
        reloadComment: true,
        reloadCommentId: payload
      };
    case EDIT_REPLY:
      return {
        ...state,
        reloadReply: true,
        reloadReplyId: payload
      };
    case LOAD_REPLIES_ERROR:
    case ADD_REPLY_ERROR:
      return {
        ...state,
        reloadComment: false,
        reloadCommentId: null
      };
    case LOAD_A_REPLY_ERROR:
    case EDIT_REPLY_ERROR:
      return {
        ...state,
        reloadReply: false,
        reloadReplyId: null
      };
    default:
      return state;
  }
}