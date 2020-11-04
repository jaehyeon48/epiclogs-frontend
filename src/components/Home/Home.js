import React, { useState, useEffect } from 'react';
import axios from 'axios';

import HomePosts from './HomePosts';

const Home = () => {
  const [posts, setPosts] = useState([]);

  // load all public posts
  useEffect(() => {
    (async () => {
      const res = await axios.get('http://localhost:5000/api/post/all');
      setPosts(res.data);
    })();
  }, []);

  return (
    <div className="home-posts-container">
      {posts.map((post) => (
        <HomePosts key={post.postId} post={post} />
      ))}
    </div>
  );
}

export default Home;
