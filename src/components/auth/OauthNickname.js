import React from 'react';
import CryptoJS from 'crypto-js';

const OauthNickname = ({ location }) => {
  // console.log(location.search.match(/(?!.*=).*/));
  console.log(CryptoJS.AES.decrypt(location.search.match(/(?!.*=).*/)[0]), 'a1mre43gsdfa9ger04gbq10fd9ae9bf9d');
  return (
    <div>
      oauth
    </div>
  );
}

export default OauthNickname;
