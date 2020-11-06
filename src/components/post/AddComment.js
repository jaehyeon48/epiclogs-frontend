import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { addComment } from '../../actions/commentAction';

const AddComment = ({
  postId,
  addComment,
  auth
}) => {
  const [comment, setComment] = useState('');
  const [isEmptyComment, setIsEmptyComment] = useState(false);

  const handleChangeComment = (e) => {
    setComment(e.target.value);
  }

  const submitComment = () => {
    if (comment.trim() === '') {
      setIsEmptyComment(true);
    }
    else {
      addComment(postId, comment);
    }
  }

  useEffect(() => {
    if (isEmptyComment && comment.trim() !== '') {
      setIsEmptyComment(false);
    }
  }, [comment, isEmptyComment]);

  const guestRender = (
    <div className="comment__not-auth">
      <span className="comment__not-auth-notice">
        Login or Sign up to leave a comment
      </span>
      <Link
        role="button"
        className="comment__login-btn"
        to="/login"
      >Login</Link>
      <Link
        role="button"
        className="comment__signup-btn"
        to="/signup"
      >Sign Up</Link>
    </div>
  );
  const authRender = (
    <div className="comment__auth">
      <div className="comment-area-wrapper">
        <textarea
          className={isEmptyComment ? "comment-area empty-comment" : "comment-area"}
          placeholder="Add a comment..."
          value={comment}
          onChange={handleChangeComment}
        ></textarea>
        {isEmptyComment && <small className="empty-comment-notice">Please enter comment.</small>}
      </div>
      <button
        type="button"
        className="add-comment-btn"
        onClick={submitComment}
      >Add a comment</button>
    </div>
  );
  return (
    <React.Fragment>
      {auth && auth.authLoading ? null : auth.isAuthenticated ? authRender : guestRender}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addComment })(AddComment);
