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

const App = () => {
  const [showBuyToken, setShowBuyToken] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [farmingEndTime, setFarmingEndTime] = useState(null);
  const [farmingError, setFarmingError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);

  // Check if user is authenticated through Telegram WebApp
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
          photo_url: webAppUser.photo_url || "https://via.placeholder.com/50",
          auth_date: webAppUser.auth_date
        };
        setUser(userData);
        verifyTelegramWebApp(webApp.initData);
      }
    }
  }, []);

  // Verify Telegram WebApp authentication
  const verifyTelegramWebApp = async (initData) => {
    try {
      const response = await fetch('https://api.hashtagdigital.net/api/auth/telegram_auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      });
      
      if (!response.ok) {
        throw new Error('WebApp verification failed');
      }

      const data = await response.json();
      if (data.user) {
        setUser({
          id: data.user.id,
          username: `${data.user.first_name} ${data.user.last_name || ''}`.trim(),
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          photo_url: data.user.photo_url || "https://via.placeholder.com/50",
          auth_date: data.user.auth_date
        });
      }
    } catch (error) {
      setAuthError('Failed to verify Telegram WebApp authentication');
    }
  };

  // Handle standalone Telegram login button response
  const handleTelegramResponse = async (response) => {
    try {
      const result = await fetch("https://api.hashtagdigital.net/api/auth/telegram_auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });
      
      if (!result.ok) {
        throw new Error('Authentication failed');
      }
      
      const data = await result.json();
      if (data.user) {
        setUser({
          id: data.user.id,
          username: `${data.user.first_name} ${data.user.last_name || ''}`.trim(),
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          photo_url: data.user.photo_url || "https://via.placeholder.com/50",
          auth_date: data.user.auth_date
        });
      }
    } catch (error) {
      setAuthError(error.message || "Authentication failed");
    }
  };

  useEffect(() => {
    const checkFarmingStatus = () => {
      const storedEndTime = localStorage.getItem('farmingEndTime');
      if (storedEndTime) {
        const endTime = new Date(storedEndTime);
        const now = new Date();
        
        if (endTime > now) {
          setFarmingEndTime(storedEndTime);
        } else {
          localStorage.removeItem('farmingEndTime');
          setFarmingEndTime(null);
        }
      }
    };
    checkFarmingStatus();
  }, []);

  const handleBuyHTCClick = () => setShowBuyToken(true);
  const handleClaimClick = () => setShowRewardModal(true);
  const handleBackFromBuy = () => setShowBuyToken(false);
  const handleCloseRewardModal = () => setShowRewardModal(false);

  const handleStartFarming = async () => {
    try {
      setFarmingError(null);
      const response = await fetch('https://api.hashtagdigital.net/api/start-farming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration: 480 })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Farming is already active") {
          setFarmingError("Farming is already in progress. Please wait for the current session to end.");
        } else {
          throw new Error(data.message || 'Failed to start farming');
        }
        return;
      }

      setFarmingEndTime(data.farmingEndTime);
      localStorage.setItem('farmingEndTime', data.farmingEndTime);
    } catch (error) {
      console.error('Error starting farming:', error);
      setFarmingError('Failed to start farming. Please try again.');
    }
  };

  return (
    <div className="appII">
      {/* Show Telegram login button if not authenticated */}
      {!user && !window.Telegram?.WebApp && (
        <div className="text-center my-4">
          <TelegramLoginButton
            botName="Hashtag001bot"
            dataOnauth={handleTelegramResponse}
          />
          {authError && (
            <p className="text-red-500 mt-2">{authError}</p>
          )}
        </div>
      )}

      {user && (
        <>
          <Header
            username={user.username}
            level="LV 1"
            profilePhoto={user.photo_url}
          />

          {!showBuyToken && (
            <>
              <ClaimSection
                onClaimClick={handleClaimClick}
                farmingEndTime={farmingEndTime}
              />
              <AvatarCard />
              <GamifySystemCard
                title=""
                cardText="Claim Your"
                buttonLabel="Daily Bonus"
                onButtonClick={handleClaimClick}
                button1Label={farmingError ? "Farming Active" : "Start Farming"}
                button2Label="Buy $HTC"
                onButton1Click={handleStartFarming}
                onButton2Click={handleBuyHTCClick}
              />
            </>
          )}

          {farmingError && (
            <div className="text-red-500 text-center mt-2">
              {farmingError}
            </div>
          )}

          {showBuyToken && <BuyTokenComponent onBack={handleBackFromBuy} />}
          {showRewardModal && <RewardModal onClose={handleCloseRewardModal} />}

          <BottomSpacer />
        </>
      )}
    </div>
  );
};

export default App;