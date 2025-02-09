import React, { useState, useEffect } from 'react';
import TelegramLoginButton from 'react-telegram-login';
import '../App.css';
import Header from '../components/Header';
import AvatarCard from '../components/AvatarCard';
import RewardModal from '../components/RewardModal';
import ClaimSection from '../components/ClaimSection';
import GamifySystemCard from "../components/GamifySystemCard";
import BuyTokenComponent from '../components/BuyTokenComponent';
import BottomSpacer from '../components/BottomSpacer';
import ConnectWallet from '../components/ConnectWallet';
import { getAuthToken, setAuthToken, removeAuthToken, resetAllAuthData } from '../config';
import { useTelegram } from "../hooks/useTelegram";

const DEFAULT_USER = {
  id: 'guest',
  username: 'Guest User',
  first_name: 'Guest',
  last_name: '',
  photo_url: "https://via.placeholder.com/50",
  auth_date: null
};

const App = () => {
  const [user, setUser] = useState(DEFAULT_USER);
  const [referralCode, setReferralCode] = useState(null);
  const [showBuyToken, setShowBuyToken] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [farmingError, setFarmingError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [farming, setFarming] = useState(false);
  const [farmingStatus, setFarmingStatus] = useState({
    isActive: false,
    startTime: null
  });

  const { tg, theme, close, expand, showMainButton } = useTelegram();

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
    expand();
    showMainButton("Submit", () => alert("Main Button Clicked!"));
  }, []);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.expand();

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

        // Extract referral code from `start`
        const startParam = webApp.initDataUnsafe.start;
        if (startParam) {
          setReferralCode(startParam);
          localStorage.setItem('referralCode', startParam);
          console.log(`Referral Code Found: ${startParam}`);
        } else {
          console.log("No referral code found.");
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
        onConnectWallet={() => setShowConnectWallet(true)}
        walletConnected={walletConnected}
      />

      <div style={{ padding: "20px", background: theme === "dark" ? "#222" : "#fff", color: theme === "dark" ? "#fff" : "#000" }}>
        <h2>Welcome, {user?.first_name || "Guest"} 👋</h2>
        <p>User ID: {user?.id}</p>
        <p>Theme: {theme}</p>
        <button onClick={close} style={{ marginTop: "10px", padding: "10px" }}>Close App</button>
      </div>

      {/* Display Referral Code */}
      <div className="referral-section" style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h3>Referral Code</h3>
        {referralCode ? (
          <p><strong>{referralCode}</strong></p>
        ) : (
          <p>No referral code provided</p>
        )}
      </div>

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
