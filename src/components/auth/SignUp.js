import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

import { showAlert } from '../../actions/alertAction';
import { signUp } from '../../actions/authAction';

require('dotenv').config();

const SignUp = ({
  showAlert,
  signUp
}) => {
  let history = useHistory();
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    nickname: '',
    email: '',
    password: ''
  });
  const [isFirstSignUpTry, setIsFirstSignUpTry] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const [nicknameDuplicateError, setNicknameDuplicateError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailDuplicateError, setEmailDuplicateError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const { name, nickname, email, password } = signUpForm;

  // validate name
  useEffect(() => {
    if (!isFirstSignUpTry && name.trim() !== '') {
      setNameError(false);
    }
    else if (!isFirstSignUpTry && name.trim() === '') {
      setNameError(true);
    }
  }, [isFirstSignUpTry, name, nameError]);

  // validate nickname
  useEffect(() => {
    if (!isFirstSignUpTry && nickname.trim() !== '') {
      setNicknameError(false);
    }
    else if (!isFirstSignUpTry && nickname.trim() === '') {
      setNicknameError(true);
    }
  }, [isFirstSignUpTry, nickname, nicknameError]);

  // validate email
  useEffect(() => {
    if (!isFirstSignUpTry && isEmail(email)) {
      setEmailError(false);
    }
    else if (!isFirstSignUpTry && !isEmail(email)) {
      setEmailError(true);
    }
  }, [isFirstSignUpTry, email, emailError]);

  // validate password
  useEffect(() => {
    if (!isFirstSignUpTry && password.trim() !== '' && isLength(password, { min: 4 })) {
      setPwError(false);
    }
    else if (!isFirstSignUpTry && (password.trim() === '' || !isLength(password, { min: 4 }))) {
      setPwError(true);
    }
  }, [isFirstSignUpTry, password, pwError]);

  // handle submit button's disable state
  useEffect(() => {
    if (!nameError && !nicknameError && !nicknameDuplicateError
      && !emailError && !emailDuplicateError && !pwError) {
      setDisableSubmit(false);
    }
    else {
      setDisableSubmit(true);
    }
  }, [nameError, nicknameError, nicknameDuplicateError,
    emailError, emailDuplicateError, pwError, disableSubmit]);

  const handleChangeSignUpForm = (e) => {
    setSignUpForm({
      ...signUpForm,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmitSignUpForm = async (e) => {
    e.preventDefault();

    if (isFirstSignUpTry) {
      setIsFirstSignUpTry(false);
      const isNameValid = name.trim() !== '';
      const isNicknameValid = nickname.trim() !== '';
      const isEmailValid = isEmail(email);
      const isPwValid = (password.trim() !== '' && isLength(password, { min: 4 }));

      if (!isNameValid) {
        setNameError(true);
      }

      if (!isNicknameValid) {
        setNicknameError(true);
      }

      if (!isEmailValid) {
        setEmailError(true);
      }
      if (!isPwValid) {
        setPwError(true);
      }

      // if name, email and pw are valid, process form
      if (isNameValid && isNicknameValid && isEmailValid && isPwValid) {
        signUp(signUpForm, history);
      }
      else {
        showAlert('Email or password is invalid.', 'error');
      }
    }
    else {
      if (!nameError && !nicknameError && !emailError && !pwError) {
        signUp(signUpForm, history);
      }
      else {
        showAlert('Email or password is invalid.', 'error');
      }
    }
  }

  const checkEmailDuplication = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const duplicateRes = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/email-duplicate`, JSON.stringify({ email }), config);

    const code = duplicateRes.data.code;

    if (code === -100) {
      setEmailDuplicateError(true);
    }
    else {
      setEmailDuplicateError(false);
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
    <main className="signup-page">
      <header className="signup-page__header">
        <p className="signup-page__site-name">EPICLOGS</p>
        <h1 className="signup-page__main-title">Sign Up</h1>
      </header>
      <section className="signup-page__form-section">
        <form
          className="signup-page__auth-form"
          onSubmit={handleSubmitSignUpForm}
        >
          <div className="signup-page__name-form">
            <label
              htmlFor="login-name-input"
              style={nameError ? { color: 'red' } : null}
            >Name</label>
            <input
              id="login-name-input"
              className="auth-input signup-page__name"
              style={nameError ? { borderBottom: '2px solid red' } : null}
              type="text"
              name="name"
              value={name}
              onChange={handleChangeSignUpForm}
            />
            {nameError && (<small style={{ color: 'red' }}>Name is invalid.</small>)}
          </div>
          <div className="signup-page__nickname-form">
            <label
              htmlFor="login-nickname-input"
              style={nicknameError || nicknameDuplicateError ?
                { color: 'red' } : null}
            >Nickname</label>
            <input
              id="login-nickname-input"
              className="auth-input signup-page__nickname"
              style={nicknameError || nicknameDuplicateError ?
                { borderBottom: '2px solid red' } : null}
              type="text"
              name="nickname"
              value={nickname}
              onChange={handleChangeSignUpForm}
              onKeyUp={checkNicknameDuplication}
            />
            {nicknameError && (<small style={{ color: 'red' }}>Nickname is invalid.</small>)}
            {!nicknameError && nicknameDuplicateError
              && (<small style={{ color: 'red' }}>Nickname already exists.</small>)}
          </div>
          <div className="signup-page__email-form">
            <label
              htmlFor="login-email-input"
              style={emailError || emailDuplicateError ?
                { color: 'red' } : null}
            >Email</label>
            <input
              id="login-email-input"
              className="auth-input signup-page__email"
              style={emailError || emailDuplicateError ?
                { borderBottom: '2px solid red' } : null}
              type="text"
              name="email"
              value={email}
              onChange={handleChangeSignUpForm}
              onKeyUp={checkEmailDuplication}
            />
            {emailError && (<small style={{ color: 'red' }}>Email is invalid.</small>)}
            {!emailError && emailDuplicateError
              && (<small style={{ color: 'red' }}>Email already exists.</small>)}
          </div>
          <div className="signup-page__password-form">
            <label
              htmlFor="login-password-input"
              style={pwError ? { color: 'red' } : null}
            >Password</label>
            <input
              id="login-password-input"
              className="auth-input signup-page__password"
              style={pwError ? { borderBottom: '2px solid red' } : null}
              type="password"
              name="password"
              value={password}
              onChange={handleChangeSignUpForm}
            />
            {pwError && (<small style={{ color: 'red' }}>Password is invalid.</small>)}
          </div>
          <button
            type="submit"
            className="auth-submit-button signup-page__submit-button"
            disabled={disableSubmit}
          >SIGN UP</button>
        </form>
      </section>
      <p
        className="signup-page__login"
      >
        Already have an account? <Link to="/login" className="signup-page__login-link">Login</Link>
      </p>
      <hr className="signup-page__social-section" data-content="Sign up With Social Account"></hr>
      <section className="signup-page__social-auth">
        <a
          href="https://epiclogs.herokuapp.com/api/auth/login/google"
          className="signup-page__google-auth"
        >
          <svg viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
            <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
            <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
            <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
            <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
          </svg>
        </a>
        <a
          href="https://epiclogs.herokuapp.com/api/auth/login/github"
          className="signup-page__github-auth"
        >
          <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
          </svg>
        </a>
      </section>
    </main>
  );
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, {
  showAlert,
  signUp
})(SignUp);
