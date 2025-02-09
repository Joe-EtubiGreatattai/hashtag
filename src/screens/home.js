import React, { useState, useEffect } from 'react';
import TelegramLoginButton from 'react-telegram-login';
import '../App.css';
import Header from '../components/Header';
import BottomSpacer from '../components/BottomSpacer';
import { getAuthToken, setAuthToken } from '../config';
import { useTelegram } from "../hooks/useTelegram";

const DEFAULT_USER = {
  id: 'guest',
  username: 'Guest User',
  first_name: 'Guest',
  last_name: '',
  photo_url: "https://via.placeholder.com/50",
  auth_date: null
};

// Utility component to display object properties
const ObjectDisplay = ({ obj, depth = 0 }) => {
  if (!obj) return <div className="ml-4">null</div>;
  
  if (typeof obj !== 'object') {
    return <div className="ml-4">{String(obj)}</div>;
  }

  return (
    <div className="ml-4">
      {Object.entries(obj).map(([key, value]) => {
        // Skip functions and circular references
        if (typeof value === 'function') {
          return (
            <div key={key} className="my-1">
              <strong>{key}</strong>: [Function]
            </div>
          );
        }
        
        // Handle nested objects
        if (typeof value === 'object' && value !== null) {
          return (
            <div key={key} className="my-1">
              <strong>{key}</strong>: {
                Array.isArray(value) ? 
                  `[${value.join(', ')}]` :
                  <ObjectDisplay obj={value} depth={depth + 1} />
              }
            </div>
          );
        }

        return (
          <div key={key} className="my-1">
            <strong>{key}</strong>: {String(value)}
          </div>
        );
      })}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(DEFAULT_USER);
  const [referralCode, setReferralCode] = useState(null);
  const [authError, setAuthError] = useState(null);
  const { tg, theme } = useTelegram();
  const [webAppData, setWebAppData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = getAuthToken();
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.clear();
        setUser(DEFAULT_USER);
      }
    }
  }, []);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.expand();
      
      // Store WebApp data for display
      setWebAppData(webApp);

      const webAppUser = webApp.initDataUnsafe?.user;
      if (webAppUser) {
        const userData = {
          id: webAppUser.id,
          username: webAppUser.username || `${webAppUser.first_name} ${webAppUser.last_name || ''}`.trim(),
          first_name: webAppUser.first_name,
          last_name: webAppUser.last_name,
          photo_url: webAppUser.photo_url || DEFAULT_USER.photo_url,
          auth_date: webAppUser.auth_date
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        const startParam = webApp.initDataUnsafe.start;
        if (startParam) {
          setReferralCode(startParam);
          localStorage.setItem('referralCode', startParam);
        }

        setAuthToken(webApp.initData);
        verifyTelegramWebApp(webApp.initData);
      }
    }
  }, []);

  const verifyTelegramWebApp = async (initData) => {
    try {
      const response = await fetch('https://api.hashtagdigital.net/api/auth/telegram_auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });

      if (!response.ok) throw new Error('WebApp verification failed');

      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuthToken(data.user.token);
      }
    } catch (error) {
      setAuthError('Failed to verify Telegram WebApp authentication');
    }
  };

  return (
    <div className="appII">
      <Header
        username={user.username}
        level="LV 1"
        profilePhoto={user.photo_url}
      />

      <div style={{ padding: "20px", background: theme === "dark" ? "#222" : "#fff", color: theme === "dark" ? "#fff" : "#000" }}>
        <h2>Telegram WebApp Debug Info</h2>
        
        {webAppData ? (
          <div className="webapp-debug" style={{ 
            background: theme === "dark" ? "#333" : "#f5f5f5",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "10px",
            overflowX: "auto"
          }}>
            <ObjectDisplay obj={webAppData} />
          </div>
        ) : (
          <p>Telegram WebApp not available</p>
        )}

        <hr style={{ margin: "20px 0" }} />
        
        <h3>User Info</h3>
        <p>Welcome, {user?.first_name || "Guest"} 👋</p>
        <p>User ID: {user?.id}</p>
        <p>Theme: {theme}</p>
      </div>

      {referralCode && (
        <div className="referral-section" style={{ margin: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <h3>Referral Code</h3>
          <p><strong>{referralCode}</strong></p>
        </div>
      )}

      {user.id === 'guest' && (
        <div className="text-center my-4">
          <TelegramLoginButton botName="Hashtag001bot" dataOnauth={verifyTelegramWebApp} />
          {authError && <p className="text-red-500 mt-2">{authError}</p>}
        </div>
      )}

      <BottomSpacer />
    </div>
  );
};

export default App;