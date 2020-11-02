import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
require('dotenv').config();

const OauthNickname = ({ location }) => {
  let history = useHistory();

  useEffect(() => {
    if (location.search.length !== 47) { // including ?q=
      return history.push('/404');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const passedUserId = location.search.slice(3);
    (async () => {
      const checkingRes = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/check-google-user`,
        JSON.stringify({ userId: passedUserId }), config);

      if (checkingRes.data.res === -1) {
        return history.push('/404');
      }
    })();
  }, [location.search]);

  const decryptedUserId = CryptoJS.AES.decrypt(location.search.slice(3), process.env.REACT_APP_AES_SECRET);

  const userId = decryptedUserId.toString(CryptoJS.enc.Utf8);

  return (
    <div>
      oauth
    </div>
  );
}

export default OauthNickname;
