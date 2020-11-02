import React from 'react';
import { Redirect } from 'react-router-dom';
import CryptoJS from 'crypto-js';
require('dotenv').config();

const OauthNickname = ({ location }) => {
  if (location.search.length !== 47) { // including ?q=
    return <Redirect to="/404" />
  }

  const decryptedUserId = CryptoJS.AES.decrypt(location.search.slice(3), process.env.REACT_APP_AES_SECRET);

  const userId = decryptedUserId.toString(CryptoJS.enc.Utf8);

  return (
    <div>
      oauth
    </div>
  );
}

export default OauthNickname;
