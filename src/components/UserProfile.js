// src/UserProfile.js
import React, { useEffect, useState } from 'react';
import { WebApp } from 'telegram-web-app';

const UserProfile = () => {
  const [user, setUser] = useState(null);

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
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <img src={user.photoUrl} alt="User" style={styles.image} />
      <h1 style={styles.name}>{`${user.firstName} ${user.lastName}`}</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '20px',
  },
  name: {
    fontSize: '24px',
    color: '#333',
  },
};

export default UserProfile;