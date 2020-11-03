import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import Avatar from './Avatar';

import { uploadAvatarToS3 } from '../utils/aws-s3';
import {
  uploadAvatar,
  deleteAvatar,
  modifyUsername,
  modifyUserNickname
} from '../actions/authAction';
import { showAlert } from '../actions/alertAction';

const Profile = ({
  uploadAvatar,
  deleteAvatar,
  modifyUsername,
  modifyUserNickname,
  showAlert,
  user
}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, [user, user.email]);

  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
    }
  }, [user, user.name]);

  useEffect(() => {
    if (user && user.nickname) {
      setUserNickname(user.nickname);
    }
  }, [user, user.nickname]);

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

  const handleChangeUserEmail = (e) => {
    setUserEmail(e.target.value);
  }

  const handleChangeUserName = (e) => {
    setUserName(e.target.value);
  }

  const handleChangeUserNickname = (e) => {
    setUserNickname(e.target.value);
  }

  const handleChangeUserPassword = (e) => {
    setUserPassword(e.target.value);
  }

  const handleChangeConfirmPw = (e) => {
    setConfirmPw(e.target.value);
  }

  const handleModifyUserName = async () => {
    if (userName.trim() === '') {
      return showAlert('Please input valid name.', 'error');
    }

    const modifyRes = await modifyUsername(userName);
    if (modifyRes === 0) {
      showAlert('Successfully updated name.', 'success');
    }
    else {
      showAlert('Something went wrong. Please try again.', 'error');
    }
  }

  const handleModifyNickname = async () => {
    if (userNickname.trim() === '') {
      return showAlert('Please input nickname.', 'error');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const duplicateRes = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/nickname-duplicate`, JSON.stringify({ nickname: userNickname }), config);

    if (duplicateRes.data.code === -101) {
      return showAlert('Nickname already exists.', 'error');
    }

    const modifyRes = await modifyUserNickname(userNickname);
    if (modifyRes === 0) {
      showAlert('Successfully updated nickname.', 'success');
    }
    else {
      showAlert('Something went wrong. Please try again.', 'error');
    }
  }

  const handleModifyPassword = () => {
    console.log(userPassword, confirmPw);
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
      <div className="profile__user-info">
        <div className="user-infos profile__user-email-container">
          <label htmlFor="profile__user-email">Email</label>
          <input
            id="profile__user-email"
            type="text"
            name={userEmail}
            value={userEmail}
            onChange={handleChangeUserEmail}
            disabled
          />
        </div>
        <div className="user-infos profile__user-name-container">
          <label htmlFor="profile__user-name">Name</label>
          <input
            id="profile__user-name"
            type="text"
            name={userName}
            value={userName}
            onChange={handleChangeUserName}
          />
          <button
            type="button"
            className="btn-modify-profile btn-modify-user-name"
            onClick={handleModifyUserName}
          >Modify</button>
        </div>
        <div className="user-infos profile__user-nickname-container">
          <label htmlFor="profile__user-nickname">Nickname</label>
          <input
            id="profile__user-nickname"
            type="text"
            name={userNickname}
            value={userNickname}
            onChange={handleChangeUserNickname}
          />
          <button
            type="button"
            className="btn-modify-profile btn-modify-user-nickname"
            onClick={handleModifyNickname}
          >Modify</button>
        </div>
        <div className="user-infos profile__user-password-container">
          <label htmlFor="profile__user-password">New Password</label>
          <input
            id="profile__user-password"
            type="password"
            name={userPassword}
            value={userPassword}
            onChange={handleChangeUserPassword}
          />
        </div>
        <div className="user-infos profile__user-confirm-pw-container">
          <label htmlFor="profile__user-confirm-pw">Confirm Password</label>
          <input
            id="profile__user-confirm-pw"
            type="password"
            name={confirmPw}
            value={confirmPw}
            onChange={handleChangeConfirmPw}
          />
          <button
            type="button"
            className="btn-modify-profile btn-modify-user-pw"
            onClick={handleModifyPassword}
          >Modify</button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {
  uploadAvatar,
  deleteAvatar,
  modifyUsername,
  modifyUserNickname,
  showAlert
})(Profile);
