import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Quill from 'quill';
import quillEmoji from 'quill-emoji';
import { v4 as uuidv4 } from 'uuid';
import 'quill/dist/quill.snow.css';

import Toolbar from './Toolbar';
import AddLink from './AddLink';

import { uploadImageToS3 } from '../../utils/aws-s3';


const Module = Quill.import('core/module');
const BlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends BlockEmbed {
  static blotName = 'image';
  static tagName = 'figure';

  static create(imageUrl) {
    const node = super.create();
    node.classList.add('ql-figure');
    node.setAttribute('contenteditable', 'false');

    const imgWrapper = document.createElement('div');
    const imgElem = document.createElement('img');

    imgWrapper.setAttribute('class', 'ql-image-wrapper');
    imgElem.className = 'ql-image'
    imgElem.setAttribute('src', imageUrl);
    imgWrapper.appendChild(imgElem);

    node.appendChild(imgWrapper);
    return node;
  }


  constructor(node) { // node === each figure element
    super(node);

    const imgElem = node.firstChild.firstChild;
    const figcaptionElem = document.createElement('figcaption');
    figcaptionElem.className = 'ql-figcaption';

    // get caption text from user
    const captionInputWrapper = document.createElement('div');
    const captionInput = document.createElement('input');
    const captionApplyBtn = document.createElement('button');
    const cancelCaption = document.createElement('div');
    captionInputWrapper.className = 'caption-input-wrapper';
    captionInput.setAttribute('type', 'text');
    captionInput.className = 'ql-caption-input';

    captionApplyBtn.setAttribute('type', 'button');
    captionApplyBtn.className = 'caption-apply-btn';
    captionApplyBtn.innerText = 'Apply';

    cancelCaption.innerHTML = 'X';
    cancelCaption.className = 'cancel-caption';

    captionInputWrapper.appendChild(captionInput);
    captionInputWrapper.appendChild(captionApplyBtn);
    captionInputWrapper.appendChild(cancelCaption);
    captionInput.addEventListener('blur', (e) => {
      // re-focus cause it loses focus automatically at first
      setTimeout(() => {
        e.target.focus();
      }, 0);
    });
    cancelCaption.addEventListener('click', (e) => {
      const target = e.target;
      // remove caption input's value
      target.previousSibling.previousSibling.value = '';
      // close caption input wrapper
      target.parentNode.parentNode.removeChild(target.parentNode);
    });

    // when user clicks the image, show 'Caption' button
    imgElem.addEventListener('click', (e) => {
      // check if there are any opened (showed) 'Caption' button
      const isCaptionActionOpened = document.querySelector('.ql-image-actions');

      // check if there are any opened (showed) caption input
      const isCaptionInputOpened = document.querySelector('.caption-input-wrapper');

      // do not open captionActionDiv when the captionInput is opened
      // or a caption is already applied
      const cList = node.lastChild.classList;
      if (cList.contains('ql-image-wrapper')
        && !isCaptionActionOpened && !isCaptionInputOpened) {
        const captionActionDiv = document.createElement('div');
        const closeCaptionBtn = document.createElement('div');

        captionActionDiv.className = 'ql-image-actions';
        captionActionDiv.innerText = 'Caption';
        closeCaptionBtn.className = 'close-caption-btn';
        closeCaptionBtn.innerText = 'X';
        captionActionDiv.appendChild(closeCaptionBtn);
        imgElem.parentNode.append(captionActionDiv);

        /* Did not add close caption button event handler intentionally 
          because I utilized event bubbling from module
        */
        captionActionDiv.addEventListener('click', openCaptionInput);
      }
    });

    // when user clicks 'apply' button on caption input wrapper, add the 
    // caption onto the image
    const applyCaption = (e) => {
      const target = e.target; // 'apply' button element
      // 'figure' element which is a parent elem of the apply button elem
      const figureElem = target.parentNode.parentNode;
      const captionValue = captionInput.value;
      if (captionValue.trim() !== '') {
        figcaptionElem.innerText = captionValue;
        captionInput.value = '';
        // for editing a caption, remove previous caption
        if (figureElem.querySelector('.ql-figcaption')) {
          figureElem.removeChild(figureElem.querySelector('.ql-figcaption'));
        }
        figureElem.appendChild(figcaptionElem);
        figureElem.removeChild(captionInputWrapper);
        figcaptionElem.addEventListener('click', openEditActionDiv);
      }
      else {
        figureElem.removeChild(captionInputWrapper);
      }
    }

    captionApplyBtn.addEventListener('click', applyCaption);

    // when user clicks 'Caption' button, show caption input wrapper
    const openCaptionInput = (e) => {
      // ignore other image's edit figcaption request
      if (document.querySelector('.caption-input-wrapper')) return;

      // from caption close button
      if (e.target.classList.contains('close-caption-btn')) return;

      // remove 'Caption' button
      imgElem.parentNode.removeChild(e.target);

      node.appendChild(captionInputWrapper);
    }

    // when user clicks applied caption to edit, show caption input wrapper
    const openEditActionDiv = (e) => {
      if (document.querySelector('.caption-input-wrapper')) return;
      if (document.querySelector('.caption-edit-actions')) return;
      const editActions = document.createElement('div');
      const editBtn = document.createElement('button');
      const deleteBtn = document.createElement('button');
      const closeBtn = document.createElement('div');

      editActions.className = 'caption-edit-actions';
      editBtn.setAttribute('type', 'button');
      editBtn.className = 'caption-edit-btn';
      editBtn.innerText = 'EDIT';
      deleteBtn.setAttribute('type', 'button');
      deleteBtn.className = 'caption-delete-btn';
      deleteBtn.innerText = 'DELETE';
      closeBtn.className = 'close-edit-actions';
      closeBtn.innerText = 'X';


      editActions.appendChild(editBtn);
      editActions.appendChild(deleteBtn);
      editActions.appendChild(closeBtn);

      editActions.addEventListener('click', openEditFigcaption);

      deleteBtn.addEventListener('click', closeEditActionsDiv);

      // close edit action div
      closeBtn.addEventListener('click', (e) => {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
      });

      node.appendChild(editActions);
    }

    const openEditFigcaption = (e) => {
      if (!e.target.classList.contains('caption-edit-btn')) return;
      node.removeChild(e.target.parentNode); // remove edit actions div
      node.appendChild(captionInputWrapper);
    }

    const closeEditActionsDiv = (e) => {
      if (!e.target.classList.contains('caption-delete-btn')) return;
      const figcaptionElem = e.target.parentNode.previousSibling;
      node.removeChild(figcaptionElem);
      node.removeChild(e.target.parentNode); // remove edit actions div
    }
  }
}

class ImageCaptionModule extends Module {
  constructor(quill, options) {
    super(quill, options);
    const listener = (e) => {
      const clsList = e.target.classList;
      // close 'Caption' button
      if (!(clsList.contains('ql-image-actions') ||
        clsList.contains('ql-image'))) {
        const captionActionBtn = document.querySelector('.ql-image-actions');
        if (captionActionBtn && captionActionBtn.parentNode) {
          captionActionBtn.parentNode.removeChild(captionActionBtn);
        }
      }
    }
    quill.emitter.listenDOM('click', document.body, listener);
  }
}

Quill.register({
  // Other formats or modules
  'formats/image': ImageBlot,
  'modules/cardEditable': ImageCaptionModule,
}, true);

const TextEditor = ({ editorRef, nickname, editPostText = null }) => {
  const nicknameRef = useRef(null);
  const [openAddLinkContainer, setOpenAddLinkContainer] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [quillState, setQuillState] = useState(null);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false);
  const [emojiInsertPos, setEmojiInsertPos] = useState(1);

  useEffect(() => {
    const initiatedQuill = initiateQuill();
    setQuillState(initiatedQuill);
  }, []);

  useEffect(() => {
    const getEmojiInsertPosition = () => {
      if (isOpenEmojiPicker) {
        setEmojiInsertPos(quillState.getSelection());
      }
    }

    if (quillState) {
      quillState.root.addEventListener('click', getEmojiInsertPosition);
      quillState.root.addEventListener('keyup', getEmojiInsertPosition);

      if (!isOpenEmojiPicker) {
        quillState.root.removeEventListener('click', getEmojiInsertPosition);
        quillState.root.removeEventListener('keyup', getEmojiInsertPosition);
      }
    }
  }, [quillState, isOpenEmojiPicker]);

  useEffect(() => {
    if (editPostText) {
      editorRef.current.firstChild.innerHTML = editPostText;
    }
  }, [editPostText]);

  const handleOpenEmojiPicker = () => {
    setIsOpenEmojiPicker(true);
  }

  const handleCloseEmojiPicker = () => {
    setIsOpenEmojiPicker(false);
  }

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
        "emoji-toolbar": true,
        history: {
          delay: 800,
          maxStack: 500,
        },
        cardEditable: true,
        syntax: true
      },
      theme: 'snow'
    });

    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('link', renderAddLinkContainer);
    toolbar.addHandler('image', saveImageToS3);
    toolbar.addHandler('emoji', handleOpenEmojiPicker);
    return quill;

    function renderAddLinkContainer() {
      // if the container is already opened, do not render new one
      if (openAddLinkContainer) return;
      // get cursor's current position
      setCursorPosition(quill.getSelection());
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
          if (quill.getSelection()) {
            quill.insertEmbed(quill.getSelection().index, 'image', uploadedUrl);
          }
          else {
            quill.insertEmbed(quill.getLength() - 1, 'image', uploadedUrl);
          }
        }
      }
    }
  }

  useEffect(() => {
    // add prevent-scroll-to-top element
    editorRef.current.firstChild.innerHTML = '<p class="prevent-scroll-to-top" contenteditable="false"></p><p></br></p>'
  }, []);

  return (
    <React.Fragment>
      <Toolbar
        isOpenEmojiPicker={isOpenEmojiPicker}
        quill={quillState}
        insertPos={emojiInsertPos}
        closeFunc={handleCloseEmojiPicker}
      />
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