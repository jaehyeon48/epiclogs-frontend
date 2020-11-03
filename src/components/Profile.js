import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import Avatar from './Avatar';

import { uploadAvatarToS3 } from '../utils/aws-s3';
import {
  uploadAvatar,
  deleteAvatar
} from '../actions/authAction';

const Profile = ({
  uploadAvatar,
  deleteAvatar
}) => {
  const imageInputRef = useRef(null);

  const handleTriggerImageInput = () => {
    imageInputRef.current.click();
  }

  const handleUploadAvatar = async (e) => {
    const imageFile = e.target.files[0]
    const fileName = uuidv4();
    const mimeType = imageFile.type.match(/\b(?!image\b)\w+/)[0];

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = async (e) => {
      const imageData = e.target.result.match(/(?!.*,).*$/)[0];
      await uploadAvatarToS3(`${fileName}.${mimeType}`,
        Buffer.from(imageData, 'base64'));
      uploadAvatar(`${fileName}.${mimeType}`);
    }
  }

  const handleDeleteAvatar = () => {
    deleteAvatar();
  }

  return (
    <div className="profile">
      <div className="profile__avatar-container">
        <div className="profile__avatar-image">
          <Avatar />
        </div>
        <div className="profile__avatar-buttons">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="profile__avatar-input"
            ref={imageInputRef}
            onChange={handleUploadAvatar}
          />
          <button
            type="button"
            className="profile__btn-upload-avatar"
            onClick={handleTriggerImageInput}
          >Upload Image</button>
          <button
            type="button"
            className="profile__btn-remove-avatar"
            onClick={handleDeleteAvatar}
          >Remove Image</button>
        </div>
      </div>
    </div>
  );
}

export default connect(null, {
  uploadAvatar,
  deleteAvatar
})(Profile);
