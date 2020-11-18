import React, { useState } from 'react';

const AddLink = ({ pos, quill, closeFunc }) => {
  const [topPos, setTopPos] = useState(quill.getBounds(pos.index).top);
  const [leftPos, setLeftPos] = useState(quill.getBounds(pos.index).left);
  const [linkTextVal, setLinkTextVal] = useState('');
  const [linkVal, setLinkVal] = useState('');

  const handleChangeLinkTextVal = (e) => {
    setLinkTextVal(e.target.value);
  }

  const handleChangeLinkVal = (e) => {
    setLinkVal(e.target.value);
  }

  function processLink(e) {
    if (linkVal) {
      if (linkTextVal === '') {
        quill.insertText(pos.index, linkVal, { 'link': linkVal });
      }
      else {
        quill.insertText(pos.index, linkTextVal, { 'link': linkVal });
      }
    }
    else {
      quill.format('link', false);
    }
    closeFunc(e, true);
  }

  return (
    <div
      className="editor-add-link-div add-link-not-close"
      style={{ top: `${topPos + 32}px`, left: `${leftPos}px` }}>
      <div className="add-link-inputs add-link-not-close">
        <label htmlFor="elti" className="add-link-not-close">Text </label>
        <input
          type="text"
          id="elti"
          className="editor-link-text-input add-link-not-close"
          placeholder="Link Text (optional)"
          value={linkTextVal}
          onChange={handleChangeLinkTextVal}
        />
      </div>
      <div className="add-link-inputs add-link-not-close">
        <label htmlFor="elli" className="add-link-not-close">Link </label>
        <input
          type="text"
          id="elli"
          className="editor-link-link-input add-link-not-close"
          value={linkVal}
          onChange={handleChangeLinkVal}
        />
      </div>
      <button
        type="button"
        className="editor-add-link-button add-link-not-close"
        onClick={processLink}
      >Add Link</button>
    </div>
  );
}

export default AddLink;
