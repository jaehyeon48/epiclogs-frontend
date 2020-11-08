import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import HomeLoading from '../../img/home-loading.gif';

import {
  loadMyPosts,
  triggerLoadMyPost
} from '../../actions/postAction';

require('dotenv').config();

const MyPost = ({
  loadMyPosts,
  triggerLoadMyPost,
  auth,
  myPosts,
  myPostLoading,
  myPostReachedLast
}) => {
  let history = useHistory();
  const [postRange, setPostRange] = useState(myPosts.length);
  const lastRange = useRef(postRange);
  const didReachedLast = useRef(myPostReachedLast);

  // load all my posts
  useEffect(() => {
    if (postRange === 0) {
      loadMyPosts(lastRange.current);
      setPostRange(prevRange => {
        lastRange.current = prevRange + 12;
        return prevRange + 12;
      });
    }
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
      triggerLoadMyPost();
      loadMyPosts(lastRange.current);
      setPostRange(prevRange => {
        lastRange.current = prevRange + 12;
        return prevRange + 12;
      });
    }
  }

  useEffect(() => {
    didReachedLast.current = myPostReachedLast;
  }, [myPostReachedLast]);

  const redirectToPostPage = (nickname, postId) => {
    history.push(`/${nickname}/${postId}`);
  }

  return (
    <div className="mypost-container">
      {myPosts && myPosts.map((myPost) => (
        <div
          key={myPost.postId}
          className="mypost-item"
          onClick={() => redirectToPostPage(myPost.nickname, myPost.postId)}
        >
          <div className="mypost-title">{myPost.title}</div>
          <div className="mypost-tags">
            {myPost && myPost.tags.map((tag, i) => (
              <div
                key={i}
                className="mypost__tag-item"
              >{tag}</div>
            ))}
          </div>
          <div className="mypost-created-at">
            {myPost.createdAt.replace('T', ' ').slice(0, 19)}
          </div>
        </div>
      ))}
      {myPostLoading && (
        <div className="mypost__loading">
          <img
            src={HomeLoading}
            alt="loading spinner"
          />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  myPosts: state.post.myPosts,
  myPostLoading: state.post.myPostLoading,
  myPostReachedLast: state.post.myPostReachedLast
});

export default connect(mapStateToProps, {
  loadMyPosts,
  triggerLoadMyPost
})(MyPost);
