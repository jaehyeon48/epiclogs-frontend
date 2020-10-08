import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';

import GoogleCallback from './components/GoogleCallback';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/oauth2/google-callback" component={GoogleCallback} exact />
      </Switch>
    </Router>
  );
}

export default App;
