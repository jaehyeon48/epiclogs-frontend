import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

import { showAlert } from '../../actions/alertAction';

import {
  login
} from '../../actions/authAction';

const Login = ({
  login,
  showAlert
}) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [isFirstLoginTry, setIsFirstLoginTry] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const { email, password } = loginForm;

  useEffect(() => {
    if (!isFirstLoginTry && isEmail(email)) {
      setEmailError(false);
    }
    else if (!isFirstLoginTry && !isEmail(email)) {
      setEmailError(true);
    }
  }, [isFirstLoginTry, email, emailError]);

  useEffect(() => {
    if (!isFirstLoginTry && password.trim() !== '' && isLength(password, { min: 4 })) {
      setPwError(false);
    }
    else if (!isFirstLoginTry && (password.trim() === '' || !isLength(password, { min: 4 }))) {
      setPwError(true);
    }
  }, [isFirstLoginTry, password, pwError]);

  useEffect(() => {
    if (!emailError && !pwError) {
      setDisableSubmit(false);
    }
    else {
      setDisableSubmit(true);
    }
  }, [emailError, pwError, disableSubmit]);

  const handleChangeLoginForm = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmitLoginForm = async (e) => {
    e.preventDefault();

    if (isFirstLoginTry) {
      setIsFirstLoginTry(false);
      const isEmailValid = isEmail(email);
      const isPwValid = (password.trim() !== '' && isLength(password, { min: 4 }));

      if (!isEmailValid) {
        setEmailError(true);
      }
      if (!isPwValid) {
        setPwError(true);
      }

      // if email and pw are valid, process form
      if (isEmailValid && isPwValid) {
        login(loginForm);
      }
      else {
        showAlert('Email or password is invalid.', 'error');
      }
    }
    else {
      if (!emailError && !pwError) {
        login(loginForm);
      }
      else {
        showAlert('Email or password is invalid.', 'error');
      }
    }
  }

  return (
    <main className="login-page">
      <header className="login-page__header">
        <p className="login-page__site-name">EPICLOGS</p>
        <h1 className="login-page__main-title">LOGIN</h1>
      </header>
      <section className="login-page__form-section">
        <form
          className="login-page__auth-form"
          onSubmit={handleSubmitLoginForm}
        >
          <div className="login-page__email-form">
            <label
              htmlFor="login-email-input"
              style={emailError ? { color: 'red' } : null}
            >Email</label>
            <input
              id="login-email-input"
              className="auth-input login-page__email"
              style={emailError ? { borderBottom: '2px solid red' } : null}
              type="text"
              name="email"
              value={email}
              onChange={handleChangeLoginForm}
            />
            {emailError && (<small style={{ color: 'red' }}>Email is invalid.</small>)}
          </div>
          <div className="login-page__password-form">
            <label
              htmlFor="login-password-input"
              style={pwError ? { color: 'red' } : null}
            >Password</label>
            <input
              id="login-password-input"
              className="auth-input login-page__password"
              style={pwError ? { borderBottom: '2px solid red' } : null}
              type="password"
              name="password"
              value={password}
              onChange={handleChangeLoginForm}
            />
            {pwError && (<small style={{ color: 'red' }}>Password is invalid.</small>)}
          </div>
          <button
            type="submit"
            className="auth-submit-button login-page__submit-button"
            disabled={disableSubmit}
          >LOGIN</button>
        </form>
      </section>
      <p
        className="login-page__sign-up"
      >
        Doesn't have an account yet? <Link to="/signup" className="login-page__sign-up-link">Sign Up</Link>
      </p>
      <hr className="login-page__social-section" data-content="Login With Social Account"></hr>
      <section className="login-page__social-auth">
        <a
          href="https://epiclogs.herokuapp.com/api/auth/login/google"
          className="login-page__google-auth"
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
          className="login-page__github-auth"
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
  login,
  showAlert
})(Login);
