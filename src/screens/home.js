import React, { useState, useEffect } from 'react';
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
  const [telegramUser, setTelegramUser] = useState(null);

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

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      console.log(window.Telegram.WebApp.initDataUnsafe);
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setTelegramUser({
          username: user.username || "User",
          photo_url: user.photo_url || "https://via.placeholder.com/50"
        });
      }
    } else {
      setTelegramUser({
        username: "test_user",
        photo_url: "https://via.placeholder.com/50"
      });
    }
  }, []);

  const handleBuyHTCClick = () => {
    setShowBuyToken(true);
  };

  const handleClaimClick = () => {
    setShowRewardModal(true);
  };

  const handleBackFromBuy = () => {
    setShowBuyToken(false);
  };

  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
  };

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

      console.log('Farming started:', data);
      setFarmingEndTime(data.farmingEndTime);
      localStorage.setItem('farmingEndTime', data.farmingEndTime);
    } catch (error) {
      console.error('Error starting farming:', error);
      setFarmingError('Failed to start farming. Please try again.');
    }
  };

  return (
    <div className="appII">
      {/* Pass Telegram user data to the Header component */}
      <Header
        username={telegramUser?.username || "User"}
        level="LV 1"
        profilePhoto={telegramUser?.photo_url || "https://via.placeholder.com/50"}
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