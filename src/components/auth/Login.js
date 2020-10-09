import React, { useState, useEffect } from 'react';

const Login = () => {
  const [loginForm, setLoginForm] = useState({});

  const { email, password } = loginForm;

  const handleChangeLoginForm = (e) => {
    setLoginForm({ [e.target.name]: e.target.value });
  }

  const handleSubmitLoginForm = () => {

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
            <input
              id="login-email-input"
              className="auth-input login-page__email"
              type="text"
              name="email"
              value={email}
              onChange={handleChangeLoginForm}
            />
            <label for="login-email-input">Email</label>
          </div>
          <div className="login-page__password-form">
            <input
              id="login-password-input"
              className="auth-input login-page__password"
              type="password"
              name="password"
              value={password}
              onChange={handleChangeLoginForm}
            />
            <label for="login-password-input">Password</label>
          </div>
          <button
            type="submit"
            className="auth-submit-button login-page__submit-button"
          >LOGIN</button>
        </form>
      </section>
    </main>
  );
}

export default Login;
