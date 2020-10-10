import React from 'react';
import { connect } from 'react-redux';

import defaultAvatar from '../img/default_avatar.png';

const AVATAR_URL = 'https://epiclogs.tk/avatars';

const Avatar = ({
  user
}) => {
  return (
    <img
      src={user && user.avatar ? `${AVATAR_URL}/${user.avatar}` : defaultAvatar}
      alt="user's avatar"
      className="avatar-image"
    />
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(Avatar);
