import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.scss';

import store from './store';
import PublicRoute from './components/PublicRoute';
import Alert from './components/Alert';
import Login from './components/auth/Login';
import GoogleCallback from './components/GoogleCallback';
import Navbar from './components/Navbar';

import { loadUser } from './actions/authAction';

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Alert />
        <Switch>
          <PublicRoute path="/login" component={Login} exact />
          <Route path="/oauth2/google-callback" component={GoogleCallback} exact />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
