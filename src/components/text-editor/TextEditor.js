import React, { useState, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import Toolbar from './Toolbar';
import AddLink from './AddLink';

const TextEditor = () => {
  const [openAddLinkContainer, setOpenAddLinkContainer] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [quillState, setQuillState] = useState(null);

  useEffect(() => {
    const initiatedQuill = initiateQuill();
    setQuillState(initiatedQuill);
  }, []);

  const handleOpenAddLinkDiv = () => {
    setOpenAddLinkContainer(true);
    document.addEventListener('click', handleCloseAddLinkDiv);
  }

  const handleCloseAddLinkDiv = (e, isDoneAddLink = false) => {
    // if adding a link is done, close the container
    if (isDoneAddLink) {
      setOpenAddLinkContainer(false);
      document.removeEventListener('click', handleCloseAddLinkDiv);
      return;
    }
    const target = e.target;
    // for clicking the link icon, add link container-related elements, do not close
    if (target.className === 'ql-link' ||
      (target.parentNode && target.parentNode.className === 'ql-link') ||
      (target.parentNode && target.parentNode.parentNode && target.parentNode.parentNode.className === 'ql-link') ||
      (target.className.includes('add-link-not-close'))) {
      return;
    }
    setOpenAddLinkContainer(false);
    document.removeEventListener('click', handleCloseAddLinkDiv);
  }

  function initiateQuill() {
    const quill = new Quill('#editor-container', {
      modules: {
        toolbar: '#editor-toolbar-container',
        history: {
          delay: 800,
          maxStack: 500,
        },
        syntax: true
      },
      theme: 'snow'
    });

    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('link', renderAddLinkContainer);

    return quill;

    function renderAddLinkContainer() {
      // if the container is already opened, do not render new one
      if (openAddLinkContainer) return;
      // get cursor's current position
      setCursorPosition(quill.getBounds(quill.getLength()));
      handleOpenAddLinkDiv();
    }
  }

  return (
    <React.Fragment>
      <Toolbar />
      <div id="editor-container">
        {openAddLinkContainer && (
          <AddLink pos={cursorPosition} quill={quillState} closeFunc={handleCloseAddLinkDiv} />
        )}
      </div>
    </React.Fragment>
  );
}

export default TextEditor;