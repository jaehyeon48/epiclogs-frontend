import React from 'react';

const HomePosts = ({ post }) => {
  return (
    <div className="home-post-item">
      <div className="home-post__title">
        {post.title}
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
