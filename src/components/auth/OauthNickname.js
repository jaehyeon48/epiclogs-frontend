import React from 'react'

const OauthNickname = ({ location }) => {
  console.log(location.search.match(/(?!.*=).*/));
  return (
    <div>
      oauth
    </div>
  );
}

export default OauthNickname;
