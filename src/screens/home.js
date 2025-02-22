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
import { TonConnect } from '@tonconnect/sdk';

const tonConnect = new TonConnect({
  manifestUrl: 'https://api.hashtagdigital.net/tonconnect-manifest.json',
});

const DEFAULT_USER = {
  id: 'guest',
  username: 'Guest User',
  first_name: 'Guest',
  last_name: '',
  photo_url: "https://via.placeholder.com/50",
  auth_date: null
};

const clearLocalStorage = () => {
  localStorage.clear();
};

const App = () => {
  const [showBuyToken, setShowBuyToken] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [farmingError, setFarmingError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(DEFAULT_USER);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
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
        clearLocalStorage();
        setUser(DEFAULT_USER);
      }
    }
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const isConnected = tonConnect.connected;
        console.log('Wallet connection status:', isConnected);
        
        if (isConnected) {
          const info = await tonConnect.getWalletInfo();
          console.log('Connected wallet info:', {
            device: info.device,
            account: {
              address: info.account.address,
              chain: info.account.chain,
              walletType: info.account.walletType,
            },
            connectTime: new Date().toISOString(),
          });
          
          setWalletInfo(info);
          setWalletConnected(true);
          localStorage.setItem('connectedWallet', JSON.stringify(info));
        } else {
          console.log('No wallet connected');
          setWalletInfo(null);
          setWalletConnected(false);
          localStorage.removeItem('connectedWallet');
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setWalletConnected(false);
        setWalletInfo(null);
        localStorage.removeItem('connectedWallet');
      }
    };

    checkWalletConnection();
    
    const unsubscribe = tonConnect.onStatusChange((wallet) => {
      if (wallet) {
        console.log('Wallet status changed - Connected:', {
          device: wallet.device,
          account: {
            address: wallet.account.address,
            chain: wallet.account.chain,
            walletType: wallet.account.walletType,
          },
          updateTime: new Date().toISOString(),
        });
        
        setWalletInfo(wallet);
        setWalletConnected(true);
        localStorage.setItem('connectedWallet', JSON.stringify(wallet));
      } else {
        console.log('Wallet status changed - Disconnected');
        setWalletInfo(null);
        setWalletConnected(false);
        localStorage.removeItem('connectedWallet');
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
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
        setAuthToken(webApp.initData);
        verifyTelegramWebApp(webApp.initData);
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

  const handleWalletConnect = async (wallet) => {
    console.log('Wallet connected:', {
      device: wallet.device,
      account: {
        address: wallet.account.address,
        chain: wallet.account.chain,
        walletType: wallet.account.walletType,
      },
      connectionTime: new Date().toISOString(),
    });
    
    setWalletConnected(true);
    setWalletInfo(wallet);
    setShowConnectWallet(false);
    localStorage.setItem('connectedWallet', JSON.stringify(wallet));
  };

  const handleWalletDisconnect = async () => {
    try {
      console.log('Initiating wallet disconnection');
      await tonConnect.disconnect();
      console.log('Wallet successfully disconnected');
      setWalletConnected(false);
      setWalletInfo(null);
      localStorage.removeItem('connectedWallet');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  useEffect(() => {
    if (walletInfo) {
      console.log('Current wallet state:', {
        connected: walletConnected,
        walletInfo: {
          device: walletInfo.device,
          account: {
            address: walletInfo.account.address,
            chain: walletInfo.account.chain,
            walletType: walletInfo.account.walletType,
          },
          lastUpdate: new Date().toISOString(),
        }
      });
    }
  }, [walletInfo, walletConnected]);
  
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
        onDisconnectWallet={handleWalletDisconnect}
        walletConnected={walletConnected}
        walletInfo={walletInfo}
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
            <button 
              onClick={() => setShowConnectWallet(false)} 
              className="mt-4 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showBuyToken && (
        <>
          <ClaimSection
            onClaimClick={() => setShowRewardModal(true)}
            farmingStatus={farmingStatus}
          />
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