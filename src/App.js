import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
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
        setUser(user);
        fetchUserProfilePhoto(user.id);
      }

      setLoading(false);
    } else {
      debugData.error = 'Telegram WebApp not available';
      setDebugInfo(debugData);
      setLoading(false);
      setError(true);
    }
  }, []);

  const fetchUserProfilePhoto = async (userId) => {
    const botToken = '504867983:AAFbJmOu-o_ccB9rKvO5bj6-Qr7RMJEETTc'; 
    try {
      const response = await axios.post(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos`, {
        user_id: userId,
        limit: 1
      });

      if (response.data && response.data.result && response.data.result.photos.length > 0) {
        const fileId = response.data.result.photos[0][0].file_id;
        fetchFileUrl(fileId);
      } else {
        console.error('No profile photo found for the user');
      }
    } catch (error) {
      console.error('Error fetching user profile photo:', error);
    }
  };

  const fetchFileUrl = async (fileId) => {
    const botToken = '504867983:AAFbJmOu-o_ccB9rKvO5bj6-Qr7RMJEETTc'; 
    try {
      const response = await axios.get(`https://api.telegram.org/bot${botToken}/getFile`, {
        params: { file_id: fileId }
      });

      if (response.data && response.data.result) {
        const filePath = response.data.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        setProfilePhotoUrl(fileUrl);
      } else {
        console.error('Error fetching file path');
      }
    } catch (error) {
      console.error('Error fetching file URL:', error);
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
