import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const AddComment = ({
  auth
}) => {
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
      <textarea
        className="comment-area"
        placeholder="Add a comment..."
      ></textarea>
      <button
        type="button"
        className="add-comment-btn"
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

export default connect(mapStateToProps)(AddComment);
