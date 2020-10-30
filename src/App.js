import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.scss';

import store from './store';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Alert from './components/Alert';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Navbar from './components/Navbar';
import AddPost from './components/post/AddPost';

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
          <PublicRoute path="/signup" component={SignUp} exact />
          <PrivateRoute path="/add-post" component={AddPost} exact />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
