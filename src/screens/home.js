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
  const [farmingEndTime, setFarmingEndTime] = useState(null);
  const [farmingError, setFarmingError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(DEFAULT_USER);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [farming, setFarming] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      window.localStorage.setItem('token', storedToken);
    }
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
        localStorage.setItem('token', webApp.initData);
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
        localStorage.setItem('token', data.token);
      }
    } catch (error) {
      setAuthError('Failed to verify Telegram WebApp authentication');
    }
  };

  const handleStartFarming = () => {
    if (farming) {
      setFarmingError("Farming is already active");
      return;
    }
    setFarming(true);
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    setFarmingEndTime(endTime);
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
          <ClaimSection onClaimClick={() => setShowRewardModal(true)} farmingEndTime={farmingEndTime} />
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
            additionalStats={{ XP: "120", Rank: "Gold", Streak: "5 Days" }}
          />
        </>
      )}
      {farmingError && <div className="text-red-500 text-center mt-2">{farmingError}</div>}
      {showBuyToken && <BuyTokenComponent onBack={() => setShowBuyToken(false)} />}
      {showRewardModal && <RewardModal onClose={() => setShowRewardModal(false)} />}
      <BottomSpacer />
    </div>
  );
};

export default App;
