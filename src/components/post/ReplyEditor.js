import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { addReply } from '../../actions/replyAction';
require('dotenv').config();

const ReplyEditor = ({
  closeReplyEditor,
  commentId,
  addReply
}) => {
  const [isEmptyReply, setIsEmptyReply] = useState(false);
  const [addReplyText, setAddReplyText] = useState('');

  useEffect(() => {
    if (isEmptyReply && addReplyText.trim() !== '') {
      setIsEmptyReply(false);
    }
  }, [addReplyText, isEmptyReply]);

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
          onClick={handleAddReply}
        >Add</button>
      </div>
    </div>
  );
}


export default connect(null, { addReply })(ReplyEditor);
