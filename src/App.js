import React, { useEffect, useState } from 'react';
import './App.css';

const TON_ADDRESS = 'UQClXO69V6LqEtlPId-WBJa3RyggyTS_8NJciV5kV2nnauuR'; // Your TON address

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const debugData = {};

    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};
      debugData.initDataUnsafe = initDataUnsafe;
      setDebugInfo(debugData);

      const user = initDataUnsafe.user;

      if (user) {
        setUser(user);
      }

      // Set theme parameters
      const {
        bg_color = '#ffffff',
        text_color = '#000000',
        hint_color = '#707070',
        link_color = '#0000ee',
        button_color = '#0088cc',
        button_text_color = '#ffffff'
      } = tg.themeParams || {};

      document.documentElement.style.setProperty('--bg-color', bg_color);
      document.documentElement.style.setProperty('--text-color', text_color);
      document.documentElement.style.setProperty('--hint-color', hint_color);
      document.documentElement.style.setProperty('--link-color', link_color);
      document.documentElement.style.setProperty('--button-color', button_color);
      document.documentElement.style.setProperty('--button-text-color', button_text_color);

      tg.MainButton.text = "Send TON";
      tg.MainButton.color = button_color;
      tg.MainButton.textColor = button_text_color;
      tg.MainButton.show();

      tg.MainButton.onClick(() => {
        openTONWallet();
      });

      setLoading(false);
    } else {
      debugData.error = 'Telegram WebApp not available';
      setDebugInfo(debugData);
      setLoading(false);
      setError(true);
    }
  }, []);

  const openTONWallet = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      const walletLink = `ton://transfer/${TON_ADDRESS}?amount=100000&text=Payment for services`;
      tg.openLink(walletLink);
    }
  };

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
      <h1>Welcome, {user && user.first_name}</h1>
      <h2>Debug Information</h2>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}

export default App;
