import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TextEditor from '../text-editor/TextEditor';

import { addPost } from '../../actions/postAction';
import { showAlert } from '../../actions/alertAction';

const AddPost = ({
  addPost,
  showAlert
}) => {
  let history = useHistory();
  const titleRef = useRef(null);
  const editorRef = useRef(null);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [tag, setTag] = useState('');
  const [registeredTags, setRegisteredTags] = useState([]);
  const [tagElements, setTagElements] = useState('');
  const [showTagTooltip, setShowTagTooltip] = useState(false);
  const [privacy, setPrivacy] = useState('public');

  useEffect(() => {
    setTagElements(registeredTags.map(registeredTag => makeTagContainer(registeredTag)).join(''));
  }, [registeredTags]);

  useEffect(() => {
    if (registeredTags.length > 4) {
      setShowTagTooltip(false);
    }
  }, [registeredTags]);

  useEffect(() => {
    if (titleError && title.trim() !== '') {
      setTitleError(false);
    }
  }, [titleError, title]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleTagChange = (e) => {
    setTag(e.target.value);
  }

  const registerTags = (e) => {
    if (e.key === 'Enter') {
      if (tag.trim() === '' || registeredTags.length > 4) return;
      // if a tag is duplicated
      if (registeredTags.find(tagItem => tagItem === tag)) {
        setTag('');
        return;
      }
      setRegisteredTags([...registeredTags, tag]);
      setTag('');
    }
  }

  const unregisterTag = (e) => {
    if (e.target.className === 'tag-item') {
      const tagName = e.target.innerText;
      setRegisteredTags(registeredTags.filter(registeredItem => registeredItem !== tagName));
    }
  }

  const makeTagContainer = (tagName) => {
    const tagContainer = (
      `<div class="tag-item">${tagName}</div>`
    );

    return tagContainer;
  }

  const openTagTooltip = () => {
    setShowTagTooltip(true);
  }

  const closeTagTooltip = () => {
    setShowTagTooltip(false);
  }

  const privacyToPublic = () => {
    setPrivacy('public');
  }

  const privacyToPrivate = () => {
    setPrivacy('private');
  }

  const handlePost = async () => {
    if (title.trim() === '') {
      titleRef.current.focus();
      setTitleError(true);
      return;
    }
    const postBody = editorRef.current.firstChild.innerHTML;

    const postRes = await addPost({ title, tag: registeredTags, postBody, privacy });
    if (postRes === '') {
      showAlert('Something went wrong. Please try again!', 'error');
    }
    else {
      history.push(postRes);
      return;
    }
  }

  return (
    <div className="add-post-container">
      <div className="add-post__title-container">
        <input
          type="text"
          className="add-post__title-input"
          style={titleError ? { border: '1px solid red' } : {}}
          value={title}
          ref={titleRef}
          placeholder="Add Your Title."
          onChange={handleTitleChange}
        />
        {titleError && <small className="add-post__title-error">Input post title.</small>}
      </div>
      <div className="add-post__tag-container">
        <div
          className="registered-tags"
          dangerouslySetInnerHTML={{ __html: tagElements }}
          onClick={unregisterTag}
        ></div>
        <input
          type="text"
          className="add-post__tag-input"
          value={tag}
          placeholder="Add Tags"
          onChange={handleTagChange}
          onFocus={openTagTooltip}
          onBlur={closeTagTooltip}
          onKeyUp={registerTags}
          disabled={registeredTags.length > 4}
        />
        {showTagTooltip && (
          <div className="tag-tooltip">
            Enter tag's name and press enter to register. Click each tags to remove.
            You can add up to 5 tags to a post.
          </div>
        )}
      </div>
      <TextEditor editorRef={editorRef} />
      <div className="add-post__privacy-settings">
        <h2>Privacy Settings</h2>
        <div className="privacy-buttons">
          <button
            type="button"
            className={`${privacy === 'public' ? 'privacy-btn add-post__privacy-public privacy-checked' : 'privacy-btn add-post__privacy-public'}`}
            onClick={privacyToPublic}
          >
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
              <path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z" />
            </svg>
        Public
        </button>
          <button
            type="button"
            className={`${privacy === 'private' ? 'privacy-btn add-post__privacy-private privacy-checked' : 'privacy-btn add-post__privacy-private'}`}
            onClick={privacyToPrivate}
          >
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="currentColor" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z" />
            </svg>
        Private
        </button>
        </div>
      </div>
      <div className="add-post__buttons">
        <button
          type="button"
          className="add-post__publish-btn"
          onClick={handlePost}
        >Publish</button>
        <button
          type="button"
          className="add-post__save-btn"
        >Save</button>
      </div>
    </div >
  )
}

export default connect(null, {
  addPost,
  showAlert
})(AddPost);
