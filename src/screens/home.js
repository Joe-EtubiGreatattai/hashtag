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

const DEFAULT_USER = {
  id: 'guest',
  username: 'Guest User',
  first_name: 'Guest',
  last_name: '',
  photo_url: "https://via.placeholder.com/50",
  auth_date: null
};

const App = () => {
  const [showBuyToken, setShowBuyToken] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [farmingError, setFarmingError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(DEFAULT_USER);
  const [referralCode, setReferralCode] = useState(""); // Store referral code
  const [walletConnected, setWalletConnected] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [farming, setFarming] = useState(false);
  const [farmingStatus, setFarmingStatus] = useState({
    isActive: false,
    startTime: null
  });

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
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      // ✅ Fully expand the Telegram Mini App
      webApp.expand();

      // ✅ Extract the start payload (referral code)
      const initData = webApp.initDataUnsafe;
      if (initData?.start_param) {
        setReferralCode(initData.start_param);
        console.log("Referral Code from Telegram:", initData.start_param);
      }

      // ✅ Extract user details if available
      if (initData?.user) {
        const userData = {
          id: initData.user.id,
          username: initData.user.username || `${initData.user.first_name} ${initData.user.last_name || ''}`.trim(),
          first_name: initData.user.first_name,
          last_name: initData.user.last_name,
          photo_url: initData.user.photo_url || DEFAULT_USER.photo_url,
          auth_date: initData.auth_date
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    }
  }, []);

  const fetchFarmingStatus = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch('https://api.hashtagdigital.net/api/fetch-farming-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Failed to fetch farming status');

      const data = await response.json();
      setFarmingStatus({
        isActive: data.status,
        startTime: data.startTime ? new Date(data.startTime) : null
      });
      setFarming(data.status);
    } catch (error) {
      console.error('Error fetching farming status:', error);
    }
  };

  useEffect(() => {
    fetchFarmingStatus();
    const intervalId = setInterval(fetchFarmingStatus, 30000);
    return () => clearInterval(intervalId);
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

  const handleStartFarming = async () => {
    if (farming) {
      setFarmingError("Farming is already active");
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch('https://api.hashtagdigital.net/api/start-farming', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.message === "Farming is already active") {
        setFarmingStatus({
          isActive: true,
          startTime: new Date(data.startTime)
        });
        setFarming(true);
      } else {
        await fetchFarmingStatus();
      }
    } catch (error) {
      setFarmingError("Failed to start farming");
      console.error('Error starting farming:', error);
    }
  };

  const handleWalletConnect = (account) => {
    setWalletConnected(true);
    setShowConnectWallet(false);
    console.log('Wallet connected:', account);
  };

  const handleBuyToken = () => {
    setShowBuyToken(true);
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

      {/* ✅ Display referral information */}
      {referralCode && (
        <div className="referral-box">
          <p>Referred by: <strong>{referralCode}</strong></p>
        </div>
      )}

      {user.id === 'guest' && (
        <div className="text-center my-4">
          <TelegramLoginButton botName="Hashtag001bot" dataOnauth={verifyTelegramWebApp} />
          {authError && <p className="text-red-500 mt-2">{authError}</p>}
        </div>
      )}
      
      {showConnectWallet && !walletConnected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <ConnectWallet onConnect={handleWalletConnect} />
            <button onClick={() => setShowConnectWallet(false)} className="mt-4 text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      {!showBuyToken && (
        <>
          <ClaimSection onClaimClick={() => setShowRewardModal(true)} farmingStatus={farmingStatus} />
          <AvatarCard profilePhoto={user.photo_url} username={user.username} />
          <GamifySystemCard
            title=""
            cardText="Claim Your "
            buttonLabel="Daily Bonus"
            onButtonClick={() => setShowRewardModal(true)}
            button1Label={farming ? "Farming Active" : "Start Farming"}
            button2Label="Buy $HTC"
            onButton1Click={handleStartFarming}
            onButton2Click={handleBuyToken}
          />
        </>
      )}

      <BottomSpacer />
    </div>
  );
};

export default App;
