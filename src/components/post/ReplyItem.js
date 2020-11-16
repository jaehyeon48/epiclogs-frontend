import React, { useState, useEffect } from 'react';
import axios from 'axios';

import defaultAvatar from '../../img/default_avatar.png';

require('dotenv').config();

const ReplyItem = ({ reply }) => {
  const signal = axios.CancelToken.source();
  const [replyUserNickname, setReplyUserNickname] = useState('');
  const [replyUserAvatar, setReplyUserAvatar] = useState('');

  useEffect(() => {
    if (reply && reply.userId) {
      (async () => {
        try {
          const replyUserInfoRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/reply/user/${reply.userId}`, { cancelToken: signal.token });
          setReplyUserNickname(replyUserInfoRes.data.replyUserInfo.nickname);
          setReplyUserAvatar(replyUserInfoRes.data.replyUserInfo.avatar);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, []);


  return (
    <div className="reply-item">
      <div className="reply__user-info">
        <div className="reply__user-avatar">
          <img
            src={replyUserAvatar || defaultAvatar}
            alt="reply commenter's avatar"
          />
        </div>
        <div className="reply__user-nickname">
          {replyUserNickname}
        </div>
      </div>
      <div className="reply-info">
        <div className="reply__text">
          {reply.replyText}
        </div>
        <div className="reply__created-at">
          {reply.createdAt.replace('T', ' ').slice(0, 19)}
        </div>
      </div>
    </div>
  );
}

export default ReplyItem;
