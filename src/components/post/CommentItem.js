import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import defaultAvatar from '../../img/default_avatar.png';
require('dotenv').config();

const CommentItem = ({
  auth,
  comment,
  loadPostComments,
  setPostComments
}) => {
  const [commenterAvatar, setCommenterAvatar] = useState('');
  const [userNickname, setUserNickname] = useState('');

  useEffect(() => {
    if (comment && comment.userId) {
      (async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/avatar/id/${comment.userId}`);
          setCommenterAvatar(res.data.avatar);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [comment]);

  useEffect(() => {
    if (comment && comment.userId) {
      (async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/nickname/${comment.userId}`);
          setUserNickname(res.data.nickname);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [comment]);

  const deleteComment = async () => {
    if (window.confirm('Do you really want to delete a comment?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/comment/${comment.commentId}`,
          { withCredentials: true });
        const commentRes = await loadPostComments();
        setPostComments(commentRes);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="post__comment-item">
      <div className="comment-info">
        <div className="comment__user-avatar-wrapper">
          <img src={commenterAvatar ?
            `https://epiclogs.tk/avatars/${commenterAvatar}` :
            defaultAvatar}
            alt="commenter's avatar"
          />
        </div>
        <div className="comment__user-and-time">
          <div className="comment-username">
            {userNickname}
          </div>
          <div className="comment-time">
            {comment.createdAt.replace('T', ' ').slice(0, 19)}
          </div>
        </div>
        {auth && !auth.loading && auth.user.userId === comment.userId && (
          <div className="comment-actions">
            <button
              type="button"
              className="comment__edit-btn">
              Edit</button>
            <button
              type="button"
              className="comment__delete-btn"
              onClick={deleteComment}
            >
              Delete</button>
          </div>
        )}
      </div>
      <div className="comment-text">
        {comment.commentText}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(CommentItem);
