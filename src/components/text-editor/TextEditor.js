import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Quill from 'quill';
import { v4 as uuidv4 } from 'uuid';
import 'quill/dist/quill.snow.css';

import Toolbar from './Toolbar';
import AddLink from './AddLink';

import { uploadImageToS3 } from '../../utils/aws-s3';

const TextEditor = ({ editorRef, nickname, editPostText = null }) => {
  const nicknameRef = useRef(null);
  const [openAddLinkContainer, setOpenAddLinkContainer] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [quillState, setQuillState] = useState(null);

  useEffect(() => {
    const initiatedQuill = initiateQuill();
    setQuillState(initiatedQuill);
  }, []);

  useEffect(() => {
    if (editPostText) {
      editorRef.current.firstChild.innerHTML = editPostText;
    }
  }, [editPostText]);

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
    toolbar.addHandler('image', saveImageToS3);

    return quill;

    function renderAddLinkContainer() {
      // if the container is already opened, do not render new one
      if (openAddLinkContainer) return;
      // get cursor's current position
      setCursorPosition(quill.getBounds(quill.getLength()));
      handleOpenAddLinkDiv();
    }

    function saveImageToS3() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = () => {
        const imageFile = input.files[0]
        const fileName = uuidv4();
        const mimeType = imageFile.type.match(/\b(?!image\b)\w+/)[0];

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = async (e) => {
          const imageData = e.target.result.match(/(?!.*,).*$/)[0];
          const uploadedUrl = await uploadImageToS3(nicknameRef.current.value,
            `${fileName}.${mimeType}`, Buffer.from(imageData, 'base64'));
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
      <input type="hidden" value={nickname || ''} ref={nicknameRef} />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  nickname: state.auth.user.nickname
});

export default connect(mapStateToProps)(TextEditor);