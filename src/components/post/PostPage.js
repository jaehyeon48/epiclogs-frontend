import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import AddComment from './AddComment';
import CommentItem from './CommentItem';
import defaultAvatar from '../../img/default_avatar.png';
require('dotenv').config();

const PostPage = ({ auth }) => {
  const signal = axios.CancelToken.source();
  let history = useHistory();
  const { nickname, postId } = useParams();
  const [post, setPost] = useState({});
  const [publisherAvatar, setPublisherAvatar] = useState('');
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);

  // get post info (title, body, createdAt)
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/${postId}`,
          { cancelToken: signal.token });
        setPost(res.data);
      } catch (error) {
        if (axios.isCancel(error)) { }
        else {
          console.log(error);
        }
      }
    })();
  }, []);

  // get publisher's avatar
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/avatar/nname/${nickname}`, { cancelToken: signal.token });
        setPublisherAvatar(res.data.avatar);
      } catch (error) {
        if (axios.isCancel(error)) { }
        else {
          console.log(error);
        }
      }
    })();
  }, []);

  // get post's tags
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/tags/${postId}`,
          { cancelToken: signal.token });
        setTags(res.data.tags);
      } catch (error) {
        if (axios.isCancel(error)) { }
        else {
          console.log(error);
        }
      }
    })();
  }, []);

  // get post's comments
  useEffect(() => {
    (async () => {
      const res = await loadPostComments();
      setComments(res);
    })();
  }, []);

  const loadPostComments = async () => {
    try {
      const commentRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comment/post/${postId}`,
        { cancelToken: signal.token });
      return commentRes.data.comments;
    } catch (error) {
      if (axios.isCancel(error)) { }
      else {
        console.log(error);
      }
    }
  }

  const redirectToEditPostPage = () => {
    history.push(`/${nickname}/${postId}/edit`);
  }

  const deletePost = async () => {
    if (window.confirm('Do you really want to delete the post?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/post/${postId}`, { withCredentials: true });
        history.push('/');
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  }

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
          {auth && !auth.loading && auth.user.nickname === nickname && (
            <div className="post__edit-actions">
              <button
                type="button"
                className="post__edit-btn"
                onClick={redirectToEditPostPage}
              >Edit</button>
              <button
                type="button"
                className="post__delete-btn"
                onClick={deletePost}
              >Delete</button>
            </div>
          )}
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
        <AddComment
          postId={postId}
          loadPostComments={loadPostComments}
          setPostComments={setComments}
        />
      </div>
      <div className="post__comments-wrapper">
        {comments && comments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            loadPostComments={loadPostComments}
            setPostComments={setComments}
          />
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PostPage);
