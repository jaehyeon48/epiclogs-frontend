import React, { useState, useEffect } from 'react';
import Quill from 'quill';
import { } from 'uuid'
import 'quill/dist/quill.snow.css';

import Toolbar from './Toolbar';
import AddLink from './AddLink';

import { uploadImageToS3 } from '../../utils/aws-s3';

const TextEditor = ({ editorRef }) => {
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
    const nodeName = target.nodeName;
    // for clicking the link icon, add link container-related elements, do not close
    // add link container
    if (target.classList.contains('add-link-not-close')) {
      return;
    }
    // the link icon
    else if (nodeName === 'button' && target.className === 'ql-link') {
      return;
    }
    else if (nodeName === 'svg' && target.parentNode.className === 'ql-link') {
      return;
    }
    else if ((nodeName === 'path' || nodeName === 'line') && target.parentNode.parentNode.className === 'ql-link') {
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
    toolbar.addHandler('image', testfunc);

    return quill;

    function renderAddLinkContainer() {
      // if the container is already opened, do not render new one
      if (openAddLinkContainer) return;
      // get cursor's current position
      setCursorPosition(quill.getBounds(quill.getLength()));
      handleOpenAddLinkDiv();
    }

    function testfunc() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = () => {
        const imageFile = input.files[0]
        const fileName = imageFile.name;
        const mimeType = imageFile.type.match(/\b(?!image\b)\w+/)[0];

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = async (e) => {
          const imageData = e.target.result.match(/(?!.*,).*$/)[0];
          const uploadedUrl = await uploadImageToS3(fileName, Buffer.from(imageData, 'base64'));
          quill.insertEmbed(quill.getSelection().index, 'image', uploadedUrl);
        }
      }
    }
  }

  return (
    <React.Fragment>
      <Toolbar />
      <div id="editor-container" ref={editorRef}>
        {openAddLinkContainer && (
          <AddLink pos={cursorPosition} quill={quillState} closeFunc={handleCloseAddLinkDiv} />
        )}
      </div>
    </React.Fragment>
  );
}

export default TextEditor;