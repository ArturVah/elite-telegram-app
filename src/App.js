import React, { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState(null);
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
      const chat = initDataUnsafe.chat;

      if (user) {
        setUser(user);
      }

      if (chat) {
        setChat(chat);
      }

      setLoading(false);
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
          <h1>Welcome, {user.first_name} {user.last_name}</h1>
          <p>Username: {user.username}</p>
          <p>Language: {user.language_code}</p>
          <p>Allows Write to PM: {user.allows_write_to_pm ? 'Yes' : 'No'}</p>
          <h2>Chat Information</h2>
          {chat ? (
            <div>
              <p>Chat ID: {chat.id}</p>
              <p>Type: {chat.type}</p>
              {chat.title && <p>Title: {chat.title}</p>}
              {chat.username && <p>Username: {chat.username}</p>}
              {chat.first_name && <p>First Name: {chat.first_name}</p>}
              {chat.last_name && <p>Last Name: {chat.last_name}</p>}
            </div>
          ) : (
            <p>No chat information available</p>
          )}
          <h2>Debug Information</h2>
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
