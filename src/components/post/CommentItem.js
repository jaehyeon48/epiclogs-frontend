import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import defaultAvatar from '../../img/default_avatar.png';

import ReplyEditor from './ReplyEditor';
import { loadCommentReply } from '../../actions/replyAction';
require('dotenv').config();

const CommentItem = ({
  auth,
  comment,
  reply,
  loadPostComments,
  setPostComments,
  loadCommentReply
}) => {
  const signal = axios.CancelToken.source();
  const [commenterAvatar, setCommenterAvatar] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const [isOpenCommentEditor, setIsOpenCommentEditor] = useState(false);
  const [isOpenReplyEditor, setIsOpenReplyEditor] = useState(false);
  const [isEmptyComment, setIsEmptyComment] = useState(false);
  const [commentReply, setCommentReply] = useState([]);


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
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/avatar/id/${comment.userId}`, { cancelToken: signal.token });
          setCommenterAvatar(res.data.avatar);
        } catch (error) {
          if (axios.isCancel(error)) { }
          else {
            console.log(error);
          }
        }
      })();
    }
    return () => { signal.cancel(); }
  }, [comment]);

  useEffect(() => {
    if (comment && comment.userId) {
      (async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/nickname/${comment.userId}`, { cancelToken: signal.token });
          setUserNickname(res.data.nickname);
        } catch (error) {
          if (axios.isCancel(error)) { }
          else {
            console.log(error);
          }
        }
      })();
    }
    return () => { signal.cancel(); }
  }, [comment]);

  // load comment's reply
  useEffect(() => {
    if (comment && comment.commentId) {
      (async () => {
        try {
          const res = await loadCommentReply(comment.commentId);
          setCommentReply(res);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, []);

  // reload reply when a reply is newly created
  useEffect(() => {
    if (reply.reloadReply &&
      reply.reloadReplyComment === comment.commentId) {
      (async () => {
        try {
          const res = await loadCommentReply(comment.commentId);
          setCommentReply(res);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [reply]);

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

  const openReplyEditor = () => {
    setIsOpenReplyEditor(true);
  }

  const closeReplyEditor = () => {
    setIsOpenReplyEditor(false);
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
        {comment && comment.isEdited === 1 && (
          <span className="comment__is-edited">&#40;edited&#41;</span>
        )}
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
      {isOpenReplyEditor ? (
        <ReplyEditor
          commentId={comment.commentId}
          closeReplyEditor={closeReplyEditor} />
      ) : (
          <button
            type="button"
            className="comment__add-reply-btn"
            onClick={openReplyEditor}
          >
            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="currentColor" d="M352 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm96-160v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z" />
            </svg>
            Add a reply</button>
        )}
      <div className="comment__replys">
        {commentReply.map((reply) => (
          <div key={reply.replyId}>{reply.replyText}</div>
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  reply: state.reply
});

export default connect(mapStateToProps, { loadCommentReply })(CommentItem);
