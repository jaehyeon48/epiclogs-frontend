import { useEffect } from 'react';
import axios from 'axios';

const GoogleCallback = ({ location }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  useEffect(() => {
    const codeFromQuery = location.search.slice(6).match(/^.*(?=&scope)/)[0];

    async function sendCode(code) {
      await axios.post('https://epiclogs.herokuapp.com/api/auth/login/google-callback', JSON.stringify({ code }), config);

      window.location.href = 'https://epiclogs.tk';
    }
    sendCode(codeFromQuery);
  }, []);
  return null;
}

export default GoogleCallback;
