import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';

function App() {
  return (
    <Router>
      <Switch>
        <div className="abc">가나다 abc 123</div>
      </Switch>
    </Router>
  );
}

export default App;
