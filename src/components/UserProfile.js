// src/UserProfile.js
import React, { useEffect, useState } from 'react';
import { WebApp } from 'telegram-web-app';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [telegramResponse, setTelegramResponse] = useState(null);

  useEffect(() => {
    // Initialize the Telegram Web App
    const tg = new WebApp();

    // Get the user data from Telegram
    const userData = tg.initDataUnsafe.user;
    if (userData) {
      setUser({
        firstName: userData.first_name,
        lastName: userData.last_name,
        photoUrl: userData.photo_url,
      });
    }

    // Print the full response for debugging
    setTelegramResponse(JSON.stringify(tg.initDataUnsafe, null, 2));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {user ? (
        <>
          <img
            src={user.photoUrl}
            alt="User"
            className="w-24 h-24 rounded-full mb-4 shadow-lg"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            {`${user.firstName} ${user.lastName}`}
          </h1>
        </>
      ) : (
        <p className="text-gray-600">Loading user data...</p>
      )}

      {/* Debugging: Print the Telegram response */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Telegram Response:
        </h2>
        <pre className="text-sm text-gray-600 bg-gray-50 p-2 rounded overflow-auto">
          {telegramResponse || 'No response data available'}
        </pre>
      </div>
    </div>
  );
};

export default UserProfile;