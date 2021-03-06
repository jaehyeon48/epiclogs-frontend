import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.scss';

import store from './store';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Alert from './components/Alert';
import Home from './components/Home/Home';
import PostPage from './components/post/PostPage';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Navbar from './components/Navbar';
import AddPost from './components/post/AddPost';
import EditPost from './components/post/EditPost';
import MyPost from './components/post/MyPost';
import OauthNickname from './components/auth/OauthNickname';
import Profile from './components/Profile';

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
          <Route path="/" component={Home} exact />
          <PublicRoute path="/login" component={Login} exact />
          <PublicRoute path="/signup" component={SignUp} exact />
          <PublicRoute path="/auth/n-name" component={OauthNickname} exact />
          <Route path="/:nickname/:postId" component={PostPage} exact />
          <PrivateRoute path="/my-posts" component={MyPost} exact />
          <PrivateRoute path="/add-post" component={AddPost} exact />
          <PrivateRoute path="/:nickname/:postId/edit" component={EditPost} exact />
          <PrivateRoute path="/profile" component={Profile} exact />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
