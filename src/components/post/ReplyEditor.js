import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
  addReply,
  editReply
} from '../../actions/replyAction';
require('dotenv').config();

const ReplyEditor = ({
  closeReplyEditor,
  commentId,
  addReply,
  editReply,
  isEditMode = false,
  editReplyValue
}) => {
  const [isEmptyReply, setIsEmptyReply] = useState(false);
  const [addReplyText, setAddReplyText] = useState('');

  useEffect(() => {
    if (isEmptyReply && addReplyText.trim() !== '') {
      setIsEmptyReply(false);
    }
  }, [addReplyText, isEmptyReply]);

  // when editing reply, set previous reply text value
  useEffect(() => {
    if (isEditMode && editReplyValue !== '') {
      setAddReplyText(editReplyValue)
    }
  }, [isEditMode, editReplyValue]);

  const handleChangeEditReplyText = (e) => {
    setAddReplyText(e.target.value);
  }

  const handleAddReply = async () => {
    try {
      await addReply(addReplyText, commentId);
      closeReplyEditor();
    } catch (error) {
      console.error(error);
    }
  }

  const handleEditReply = async () => {
    try {
      await editReply(addReplyText, commentId);
      closeReplyEditor();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="reply-editor">
      <div className="reply-area-wrapper">
        <textarea
          className={isEmptyReply ? "comment-area empty-comment" : "comment-area"}
          value={addReplyText}
          onChange={handleChangeEditReplyText}
        >
        </textarea>
        {isEmptyReply && <small className="empty-comment-notice">Please enter reply.</small>}
      </div>
      <div className="reply-edit-actions">
        <button
          type="button"
          className="cancel-reply-edit"
          onClick={closeReplyEditor}
        >Cancel</button>
        <button
          type="button"
          className="add-reply-btn"
          onClick={isEditMode ? handleEditReply : handleAddReply}
        >{isEditMode ? 'Edit' : 'Add'}</button>
      </div>
    </div>
  );
}


export default connect(null, {
  addReply,
  editReply
})(ReplyEditor);
