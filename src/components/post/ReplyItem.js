import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import defaultAvatar from '../../img/default_avatar.png';
import ReplyEditor from './ReplyEditor';
import { loadReply } from '../../actions/replyAction';

require('dotenv').config();

const ReplyItem = ({
  replyFromComment, // reply data from CommentItem component
  auth,
  reply,
  loadReply
}) => {
  const signal = axios.CancelToken.source();
  const [replyText, setReplyText] = useState('');
  const [isReplyEdited, setIsReplyEdited] = useState(false);
  const [replyUserNickname, setReplyUserNickname] = useState('');
  const [replyUserAvatar, setReplyUserAvatar] = useState('');
  const [isOpenReplyEditor, setIsOpenReplyEditor] = useState(false);

  useEffect(() => {
    if (replyFromComment && replyFromComment.userId) {
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
  }, []);

  useEffect(() => {
    if (replyFromComment && replyFromComment.replyText) {
      setReplyText(replyFromComment.replyText);
    }
  }, [replyFromComment]);

  useEffect(() => {
    if (replyFromComment && replyFromComment.isEdited) {
      setIsReplyEdited(true);
    }
  }, [replyFromComment]);

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
      auth.user.userId === replyFromComment.userId) {
      setIsOpenReplyEditor(true);
    }
  }

  const closeReplyEditor = () => {
    setIsOpenReplyEditor(false);
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
          {replyUserNickname}
        </div>
      </div>
      {isOpenReplyEditor ? (
        <ReplyEditor
          commentId={replyFromComment.replyId}
          closeReplyEditor={closeReplyEditor}
          isEditMode={true}
          editReplyValue={replyText}
        />
      ) : (
          <div className="reply-info">
            <div className={auth && !auth.authLoading &&
              auth.user.userId === replyFromComment.userId ?
              "reply__text reply__editable" : "reply__text"}
              onClick={openReplyEditor}>
              {replyText}
            </div>
            <div className="reply__created-at">
              {replyFromComment.createdAt.replace('T', ' ').slice(0, 19)}
              {isReplyEdited && (
                <span className="reply__is-edited">&#40;edited&#41;</span>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  reply: state.reply
});

export default connect(mapStateToProps, { loadReply })(ReplyItem);
