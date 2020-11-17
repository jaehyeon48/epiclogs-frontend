import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import defaultAvatar from '../../img/default_avatar.png';
import ReplyEditor from './ReplyEditor';
import {
  loadReply,
  loadCommentReply
} from '../../actions/replyAction';

require('dotenv').config();

const ReplyItem = ({
  replyFromComment, // reply data from CommentItem component
  auth,
  reply,
  loadReply,
  loadCommentReply,
  setCommentReply
}) => {
  const signal = axios.CancelToken.source();
  const [replyText, setReplyText] = useState('');
  const [isReplyEdited, setIsReplyEdited] = useState(false);
  const [replyUserNickname, setReplyUserNickname] = useState('');
  const [replyUserAvatar, setReplyUserAvatar] = useState('');
  const [isOpenReplyEditor, setIsOpenReplyEditor] = useState(false);
  const [isReplyDeleted, setIsReplyDeleted] = useState(false);

  useEffect(() => {
    if (replyFromComment.isDeleted) {
      setIsReplyDeleted(true);
    }
  }, [replyFromComment]);

  useEffect(() => {
    if (replyFromComment && replyFromComment.userId && !isReplyDeleted) {
      (async () => {
        try {
          const replyUserInfoRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/reply/user/${replyFromComment.userId}`, { cancelToken: signal.token });
          setReplyUserNickname(replyUserInfoRes.data.replyUserInfo.nickname);
          setReplyUserAvatar(replyUserInfoRes.data.replyUserInfo.avatar);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [replyFromComment, isReplyDeleted]);

  // set reply text
  useEffect(() => {
    if (replyFromComment && replyFromComment.replyText && !isReplyDeleted) {
      setReplyText(replyFromComment.replyText);
    }
  }, [replyFromComment, isReplyDeleted]);

  // set reply's edited status
  useEffect(() => {
    if (replyFromComment && replyFromComment.isEdited && !isReplyDeleted) {
      setIsReplyEdited(true);
    }
  }, [replyFromComment, isReplyDeleted]);

  // reload reply after editing
  useEffect(() => {
    (async () => {
      try {
        if (reply.reloadReply && reply.reloadReplyId === replyFromComment.replyId) {
          const replyRes = await loadReply(replyFromComment.replyId);
          setReplyText(replyRes[0].replyText);
          setIsReplyEdited(replyRes[0].isEdited);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [reply]);

  const openReplyEditor = () => {
    if (auth && !auth.authLoading &&
      auth.user.userId === replyFromComment.userId &&
      !isReplyDeleted) {
      setIsOpenReplyEditor(true);
    }
  }

  const closeReplyEditor = () => {
    setIsOpenReplyEditor(false);
  }

  const handleDeleteReply = async () => {
    if (window.confirm('Do you really want to delete the reply?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/reply/${replyFromComment.replyId}`,
          { withCredentials: true });
        const commentRes = await loadCommentReply(replyFromComment.commentId);
        setCommentReply(commentRes);
        closeReplyEditor();
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="reply-item">
      <div className="reply__user-info">
        <div className="reply__user-avatar">
          <img
            src={replyUserAvatar ? `https://epiclogs.tk/avatars/${replyUserAvatar}` : defaultAvatar}
            alt="reply commenter's avatar"
          />
        </div>
        <div className="reply__user-nickname">
          {isReplyDeleted ? '' : replyUserNickname}
        </div>
      </div>
      {isOpenReplyEditor ? (
        <React.Fragment>
          <ReplyEditor
            commentId={replyFromComment.replyId}
            closeReplyEditor={closeReplyEditor}
            isEditMode={true}
            editReplyValue={replyText}
          />
          {auth && !auth.authLoading &&
            auth.user.userId === replyFromComment.userId && (
              <button
                type="button"
                className="reply__delete-btn"
                onClick={handleDeleteReply}
              >Delete</button>
            )}
        </React.Fragment>
      ) : (
          <div className="reply-info">
            <div className={isReplyDeleted ? "reply__text reply--deleted" :
              auth && !auth.authLoading && auth.user.userId === replyFromComment.userId ?
                "reply__text reply__editable" : "reply__text"}
              onClick={openReplyEditor}>
              {isReplyDeleted ? 'This reply has been deleted' : replyText}
            </div>
            {!isReplyDeleted && (
              <div className="reply__created-at">
                {replyFromComment.createdAt.replace('T', ' ').slice(0, 19)}
                {isReplyEdited && (
                  <span className="reply__is-edited">&#40;edited&#41;</span>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  reply: state.reply
});

export default connect(mapStateToProps, {
  loadReply,
  loadCommentReply
})(ReplyItem);
