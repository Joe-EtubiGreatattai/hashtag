import React, { useState, useEffect } from 'react';
import TelegramLoginButton from 'react-telegram-login';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [telegramUser, setTelegramUser] = useState({
    username: "User",
    photo_url: "https://via.placeholder.com/50"
  });

  const handleTelegramResponse = async (response) => {
    try {
      const serverResponse = await fetch('https://api.hashtagdigital.net/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
      });

      const data = await serverResponse.json();

      if (serverResponse.ok) {
        setIsAuthenticated(true);
        setTelegramUser({
          username: response.username || "User",
          photo_url: response.photo_url || "https://via.placeholder.com/50"
        });
        // Store auth token or user data in localStorage if needed
        localStorage.setItem('telegramAuth', JSON.stringify(response));
      } else {
        console.error('Authentication failed:', data.message);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  useEffect(() => {
    // Check for existing authentication
    const storedAuth = localStorage.getItem('telegramAuth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setTelegramUser({
        username: authData.username || "User",
        photo_url: authData.photo_url || "https://via.placeholder.com/50"
      });
    }

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

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.expand();
      console.log("Telegram WebApp Init Data:", webApp.initDataUnsafe);

      if (webApp.initDataUnsafe?.user) {
        handleTelegramResponse(webApp.initDataUnsafe.user);
      }
    }
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

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login with Telegram</h2>
          <TelegramLoginButton
            botName="@Hashtag001bot"
            dataOnauth={handleTelegramResponse}
            buttonSize="large"
            cornerRadius={8}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="appII">
      <Header
        username={telegramUser.username}
        level="LV 1"
        profilePhoto={telegramUser.photo_url}
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
    </div>
  );
};

export default App;