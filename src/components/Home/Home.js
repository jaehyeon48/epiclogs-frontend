import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import HomePosts from './HomePosts';
import {
  loadPublicPosts,
  triggerLoadHomePost
} from '../../actions/postAction';
import HomeLoading from '../../img/home-loading.gif';
require('dotenv').config();

const Home = ({
  loadPublicPosts,
  triggerLoadHomePost,
  publicPosts,
  homePostLoading,
  reachedLast
}) => {
  const [postRange, setPostRange] = useState(publicPosts.length);
  const lastRange = useRef(postRange);
  const didReachedLast = useRef(reachedLast);

  // load all public posts
  useEffect(() => {
    loadPublicPosts(lastRange.current);
    setPostRange(prevRange => {
      lastRange.current = prevRange + 12;
      return prevRange + 12;
    });
  }, []);

  // infinite scroll
  useEffect(() => {
    window.addEventListener('scroll', infiniteScroll);
    return () => {
      window.removeEventListener('scroll', infiniteScroll);
    }
  }, []);

  const infiniteScroll = () => {
    if (!didReachedLast.current &&
      window.innerHeight + document.documentElement.scrollTop + 1
      > document.scrollingElement.scrollHeight) {
      triggerLoadHomePost();
      loadPublicPosts(lastRange.current);
      setPostRange(prevRange => {
        lastRange.current = prevRange + 12;
        return prevRange + 12;
      });
    }
  }

  useEffect(() => {
    didReachedLast.current = reachedLast;
  }, [reachedLast]);

  return (
    <div className="home-posts-container">
      {publicPosts && publicPosts.map((post) => (
        <HomePosts key={post.postId} post={post} />
      ))}
      {homePostLoading && (
        <div className="home-posts__loading">
          <img src={HomeLoading} alt="home loading gif" />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  publicPosts: state.post.publicPosts,
  homePostLoading: state.post.homePostLoading,
  reachedLast: state.post.reachedLast
})

export default connect(mapStateToProps, {
  loadPublicPosts,
  triggerLoadHomePost
})(Home);
