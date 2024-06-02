import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('window.Telegram:', window.Telegram); // Debugging line

    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};
      console.log('initDataUnsafe:', initDataUnsafe); // Debugging line
      const user = initDataUnsafe.user;

      if (user) {
        axios.post('/auth', user)
            .then(response => {
              if (response.data.success) {
                setUser(response.data.user);
              } else {
                setError(true);
              }
            })
            .catch(error => {
              console.error('Error authenticating user:', error);
              setError(true);
            })
            .finally(() => {
              setLoading(false);
            });
      } else {
        setLoading(false);
      }
    } else {
      console.error('Telegram WebApp not available');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Authentication failed or not accessed through Telegram</div>;
  }

  return (
      <div className="App">
        {user ? (
            <h1>Welcome, {user.first_name}</h1>
        ) : (
            <h1>Authentication failed</h1>
        )}
      </div>
  );
}

export default App;
