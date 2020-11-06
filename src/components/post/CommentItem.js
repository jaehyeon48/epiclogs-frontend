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
  const [editCommentText, setEditCommentText] = useState('');
  const [isOpenCommentEditor, setIsOpenCommentEditor] = useState(false);
  const [isEmptyComment, setIsEmptyComment] = useState(false);


  // initializing edit comment text
  useEffect(() => {
    if (comment && comment.commentText) {
      setEditCommentText(comment.commentText);
    }
  }, [comment]);

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

  useEffect(() => {
    if (isEmptyComment && editCommentText.trim() !== '') {
      setIsEmptyComment(false);
    }
  }, [editCommentText, isEmptyComment]);

  const editComment = async () => {
    if (editCommentText.trim() === '') {
      setIsEmptyComment(true);
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };

    const editCommentReqBody = JSON.stringify({ editCommentText });
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/comment/${comment.commentId}`,
        editCommentReqBody, config);

      const commentRes = await loadPostComments();
      setPostComments(commentRes);
      setIsOpenCommentEditor(false);
    } catch (error) {
      console.error(error);
    }
  }

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

  const openCommentEditor = () => {
    setIsOpenCommentEditor(true);
  }

  const closeCommentEditor = () => {
    setIsOpenCommentEditor(false);
  }

  const handleChangeEditCommentText = (e) => {
    setEditCommentText(e.target.value);
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
        <div className="comment-is-edited">
          {comment && comment.isEdited === 1 && <span>&#40;edited&#41;</span>}
        </div>
        {auth && !auth.loading &&
          auth.user.userId === comment.userId && !isOpenCommentEditor && (
            <div className="comment-actions">
              <button
                type="button"
                className="comment__edit-btn"
                onClick={openCommentEditor}
              >
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
      {isOpenCommentEditor ? (
        <div className="comment-editor">
          <div className="comment-area-wrapper">
            <textarea
              className={isEmptyComment ? "comment-area empty-comment" : "comment-area"}
              value={editCommentText}
              onChange={handleChangeEditCommentText}
            >
            </textarea>
            {isEmptyComment && <small className="empty-comment-notice">Please enter comment.</small>}
          </div>
          <div className="comment-edit-actions">
            <button
              type="button"
              className="cancel-comment-edit"
              onClick={closeCommentEditor}
            >Cancel</button>
            <button
              type="button"
              className="edit-comment-btn"
              onClick={editComment}
            >Edit</button>
          </div>
        </div>
      ) : (
          <div className="comment-text">
            {comment.commentText}
          </div>
        )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(CommentItem);
