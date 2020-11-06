import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultAvatar from '../../img/default_avatar.png';

const CommentItem = ({ comment }) => {
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
      </div>
      <div className="comment-text">
        {comment.commentText}
      </div>
    </div>
  );
}

export default CommentItem;
