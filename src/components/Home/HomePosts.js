import React from 'react';
import { useHistory } from 'react-router-dom';

const HomePosts = ({ post }) => {
  let history = useHistory();
  const handleRedirectToPostPage = () => {
    history.push(`/${post.nickname}/${post.postId}`);
  }

  return (
    <div className="home-post-item" onClick={handleRedirectToPostPage}>
      <div className="home-post__title">
        {post.title}
      </div>
      <div className="home-post__tags">
        {post.tags && post.tags.map((tag, i) => (
          <div key={i}
            className="home-post__tag-item">
            {tag}
          </div>
        ))}
      </div>
      <div className="home-post__created-at">
        {post.createdAt.slice(0, 10)}
      </div>
      <div className="home-post__nickname">
        <span className="home-post__avatar">
          <img
            src={`https://epiclogs.tk/avatars/${post.avatar}`}
            alt='user avatar'
          />
        </span>
        <span className="home-post__by">by</span> {post.nickname}
      </div>
    </div>
  );
}

export default HomePosts;
