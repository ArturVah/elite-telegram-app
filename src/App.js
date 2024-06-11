import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [debugInfo, setDebugInfo] = useState({}); // State for debug information

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
        setUser(user);
        fetchUserProfilePhoto(user.id, debugData);
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

  const fetchUserProfilePhoto = async (userId, debugData) => {
    const botToken = process.env.REACT_APP_BOT_TOKEN;
    try {
      const response = await axios.post(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos`, {
        user_id: userId,
        limit: 1
      });

      debugData.profilePhotosResponse = response.data; // Add response to debug info
      setDebugInfo(debugData);

      if (response.data && response.data.result && response.data.result.photos.length > 0) {
        const fileId = response.data.result.photos[0][0].file_id;
        fetchFileUrl(fileId, debugData);
      } else {
        debugData.profilePhotoError = 'No profile photo found for the user';
        setDebugInfo(debugData);
      }
    } catch (error) {
      debugData.profilePhotoError = error.toString(); // Add error to debug info
      setDebugInfo(debugData);
    }
  };

  const fetchFileUrl = async (fileId, debugData) => {
    const botToken = process.env.REACT_APP_BOT_TOKEN;
    try {
      const response = await axios.get(`https://api.telegram.org/bot${botToken}/getFile`, {
        params: { file_id: fileId }
      });

      debugData.fileUrlResponse = response.data; // Add response to debug info
      setDebugInfo(debugData);

      if (response.data && response.data.result) {
        const filePath = response.data.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        setProfilePhotoUrl(fileUrl);
      } else {
        debugData.fileUrlError = 'Error fetching file path';
        setDebugInfo(debugData);
      }
    } catch (error) {
      debugData.fileUrlError = error.toString(); // Add error to debug info
      setDebugInfo(debugData);
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
      {user ? (
        <div>
          <h1>Welcome, {user.first_name}</h1>
          {profilePhotoUrl && <img src={profilePhotoUrl} alt="Profile" />}
          <pre>{JSON.stringify(user, null, 2)}</pre> {/* Display user information */}
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
