import React, { useState } from 'react';

const AddLink = ({ pos, quill, closeFunc }) => {
  const [linkTextVal, setLinkTextVal] = useState('');
  const [linkVal, setLinkVal] = useState('');

  const handleChangeLinkTextVal = (e) => {
    setLinkTextVal(e.target.value);
  }

  const handleChangeLinkVal = (e) => {
    setLinkVal(e.target.value);
  }

  function processLink(e) {
    const insertPosition = quill.getLength() - 1;
    if (linkVal) {
      if (linkTextVal === '') {
        quill.insertText(insertPosition, linkVal, { 'link': linkVal });
      }
      else {
        quill.insertText(insertPosition, linkTextVal, { 'link': linkVal });
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
      style={{ top: `${pos.top + 32}px`, left: `${pos.left}px` }}>
      <div className="add-link-inputs">
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
      <div className="add-link-inputs">
        <label htmlFor="elli">Link </label>
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
