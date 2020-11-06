import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import AddComment from './AddComment';
import defaultAvatar from '../../img/default_avatar.png';
require('dotenv').config();

const PostPage = () => {
  const { nickname, postId } = useParams();
  const [post, setPost] = useState({});
  const [publisherAvatar, setPublisherAvatar] = useState('');
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);

  // get post info (title, body, createdAt)
  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/${postId}`);
      setPost(res.data);
    })();
  }, []);

  // get publisher's avatar
  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/avatar/${nickname}`);
      setPublisherAvatar(res.data.avatar);
    })();
  }, []);

  // get post's tags
  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/tags/${postId}`);
      setTags(res.data.tags);
    })();
  }, []);

  return (
    <div className="post-page">
      <div className="post__header-wrapper">
        <h1>{post.title}</h1>
        <div className="post__info-wrapper">
          <div className="post__publisher-info">
            <img src={publisherAvatar ?
              `https://epiclogs.tk/avatars/${publisherAvatar}` :
              defaultAvatar}
              alt="publisher's avatar"
            />
            <p className="post__publisher-nickname">{nickname}</p>
          </div>
          <span className="post__info-separator">·</span>
          <div className="post__posted-time">
            {post.createdAt && post.createdAt.replace('T', ' ').slice(0, 19)}
          </div>
        </div>
        <div className="post__tags">
          {tags.map((tag, i) => (
            <div
              key={i}
              className="post__tag-item"
            >{tag.tagName}</div>
          ))}
        </div>
      </div>
      <div className="post__content-wrapper">
        <div
          className="post-content-style"
          dangerouslySetInnerHTML={{ __html: post.body }}></div>
      </div>
      <div className="post__comment-section-line"></div>
      <div className="post__add-comment-wrapper">
        <AddComment postId={postId} />
      </div>
    </div>
  );
}

export default PostPage;
