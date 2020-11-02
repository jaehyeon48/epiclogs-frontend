import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { registerNickname } from '../../actions/authAction';
import { showAlert } from '../../actions/alertAction';

require('dotenv').config();

const OauthNickname = ({
  location,
  registerNickname,
  showAlert
}) => {
  let history = useHistory();
  const [isFirstSubmit, setIsFirstSubmit] = useState(true);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState(false);
  const [nicknameDuplicateError, setNicknameDuplicateError] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  useEffect(() => {
    if (location.search.length !== 47) { // including ?q=
      return history.push('/404');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const passedUserId = location.search.slice(3);
    (async () => {
      const checkingRes = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/check-google-user`,
        JSON.stringify({ userId: passedUserId }), config);

      if (checkingRes.data.res === -1) {
        return history.push('/404');
      }
    })();
  }, [location.search]);

  const decryptedUserId = CryptoJS.AES.decrypt(location.search.slice(3), process.env.REACT_APP_AES_SECRET);

  const userId = decryptedUserId.toString(CryptoJS.enc.Utf8);

  useEffect(() => {
    if (!isFirstSubmit && nickname.trim() !== '') {
      setNicknameError(false);
    }
    else if (!isFirstSubmit && nickname.trim() === '') {
      setNicknameError(true);
    }
  }, [isFirstSubmit, nickname, nicknameError]);

  useEffect(() => {
    if (!nicknameError && !nicknameDuplicateError) {
      setDisableSubmit(false);
    }
    else {
      setDisableSubmit(true);
    }
  }, [nicknameError, nicknameDuplicateError, disableSubmit]);

  const handleSetNickname = (e) => {
    setNickname(e.target.value);
  }

  const handleSubmitNicknameForm = (e) => {
    e.preventDefault();
    const isNicknameValid = nickname.trim() !== '';

    if (isFirstSubmit) {
      setIsFirstSubmit(false);
      if (!isNicknameValid) {
        setNicknameError(true);
      }

      if (isNicknameValid) {
        registerNickname(userId, nickname);
      }
      else {
        showAlert('Nickname is invalid. Try again', 'error');
      }
    }
    else {
      if (isNicknameValid) {
        registerNickname(userId, nickname);
      }
      else {
        showAlert('Nickname is invalid. Try again', 'error');
      }
    }
  }

  const checkNicknameDuplication = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const duplicateRes = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/nickname-duplicate`, JSON.stringify({ nickname }), config);

    const code = duplicateRes.data.code;

    if (code === -101) {
      setNicknameDuplicateError(true);
    }
    else {
      setNicknameDuplicateError(false);
    }
  }

  return (
    <main className="nickname-page">
      <header className="nickname-page__header">
        <p className="nickname-page__site-name">EPICLOGS</p>
        <h1 className="nickname-page__main-title">Welcome!</h1>
        <p className="nickname-page__notice">Set your nickname please.</p>
      </header>
      <section className="nickname-page__form-section">
        <form
          className="nickname-page__auth-form"
          onSubmit={handleSubmitNicknameForm}
        >
          <div className="nickname-page__nickname-form">
            <label
              htmlFor="nickname-input"
              style={nicknameError || nicknameDuplicateError ?
                { color: 'red' } : null}
            >Nickname</label>
            <input
              id="nickname-input"
              className="auth-input nickname-page__nickname"
              style={nicknameError || nicknameDuplicateError ?
                { borderBottom: '2px solid red' } : null}
              type="text"
              name="nickname"
              value={nickname}
              onChange={handleSetNickname}
              onKeyUp={checkNicknameDuplication}
            />
            {nicknameError && (<small style={{ color: 'red' }}>Nickname is invalid.</small>)}
            {!nicknameError && nicknameDuplicateError
              && (<small style={{ color: 'red' }}>Nickname already exists.</small>)}
          </div>
          <button
            type="submit"
            className="auth-submit-button nickname-page__submit-button"
            disabled={disableSubmit}
          >DONE</button>
        </form>
      </section>
    </main>
  );
}

export default connect(null, {
  registerNickname,
  showAlert
})(OauthNickname);
