import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.scss';

import store from './store';
import Login from './components/auth/Login';
import GoogleCallback from './components/GoogleCallback';
import Navbar from './components/Navbar';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/login" component={Login} exact />
          <Route path="/oauth2/google-callback" component={GoogleCallback} exact />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
