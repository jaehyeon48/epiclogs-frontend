import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

import {
  auth,
  login
} from '../../actions/authAction';

const Login = ({
  login
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

      if (!isEmail(email)) {
        setEmailError(true);
      }
      if (password.trim() === '' || !isLength(password, { min: 4 })) {
        setPwError(true);
      }

      // email and pw is valid, process form
      if (!emailError && !pwError) {
        login(loginForm);
      }
      else {
        // show alert message
      }
    }
    else {
      if (!emailError && !pwError) {
        login(loginForm);
      }
      else {
        // show alert message
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
    </main>
  );
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, {
  login
})(Login);
