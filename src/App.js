import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.scss';

import axios from 'axios';

import store from './store';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Alert from './components/Alert';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Navbar from './components/Navbar';
import AddPost from './components/post/AddPost';
import OauthNickname from './components/auth/OauthNickname';

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
          <PublicRoute path="/auth/n-name" component={OauthNickname} exact />
          <PrivateRoute path="/add-post" component={AddPost} exact />
        </Switch>
      </Router>
    </Provider>
  );
}

const testfunc = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  const res = await axios.post('http://localhost:5000/api/auth/test', JSON.stringify({ hello: "world" }), config);

  console.log(res.data);
}

export default App;
