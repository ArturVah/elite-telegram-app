import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null); // State for debug information

  useEffect(() => {
    const debugData = {};

    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};
      debugData.initDataUnsafe = initDataUnsafe;
      setDebugInfo(debugData); // Update debug information in the UI

      const user = initDataUnsafe.user;

      if (user) {
        axios.post('/auth', user)
          .then(response => {
            debugData.authResponse = response.data; // Add auth response to debug info
            setDebugInfo(debugData);

            if (response.data.success) {
              setUser(response.data.user);
            } else {
              setError(true);
            }
          })
          .catch(error => {
            debugData.authError = error.toString(); // Add error to debug info
            setDebugInfo(debugData);
            setError(true);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        setError(true); // Set error if user data is not present
      }
    } else {
      debugData.error = 'Telegram WebApp not available';
      setDebugInfo(debugData);
      setLoading(false);
      setError(true);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <div>Authentication failed or not accessed through Telegram</div>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre> {/* Display debug information */}
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <div>
          <h1>Welcome, {user.first_name}</h1>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre> {/* Display debug information */}
        </div>
      ) : (
        <div>
          <h1>Authentication failed</h1>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre> {/* Display debug information */}
        </div>
      )}
    </div>
  );
}

export default App;
