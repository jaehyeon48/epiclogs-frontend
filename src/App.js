import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';

import Login from './components/auth/Login';
import GoogleCallback from './components/GoogleCallback';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/oauth2/google-callback" component={GoogleCallback} exact />
      </Switch>
    </Router>
  );
}

export default App;
