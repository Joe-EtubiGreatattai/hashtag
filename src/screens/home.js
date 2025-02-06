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

  // Load user data from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Loaded user from localStorage:", parsedUser); // Log user from localStorage
      setUser(parsedUser);
      window.localStorage.setItem('token', storedToken); // Ensure token is still in localStorage
    }
  }, []);

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
          photo_url: webAppUser.photo_url || "https://via.placeholder.com/50", // default image if none is available
          auth_date: webAppUser.auth_date
        };
        console.log("User data from WebApp:", userData); // Log user data from Telegram WebApp
        setUser(userData);
        verifyTelegramWebApp(webApp.initData);
      }
    }
  }, []);

  // Verify Telegram WebApp authentication
  const verifyTelegramWebApp = async (initData) => {
    try {
      console.log("Verifying Telegram WebApp with initData:", initData);
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
      console.log("Verification response data:", data); // Log response from server
      if (data.user) {
        const userData = {
          id: data.user.id,
          username: `${data.user.first_name} ${data.user.last_name || ''}`.trim(),
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          photo_url: data.user.photo_url || "https://via.placeholder.com/50", // Default photo URL if none
          auth_date: data.user.auth_date
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
      }
    } catch (error) {
      console.error('Error verifying Telegram WebApp:', error);
      setAuthError('Failed to verify Telegram WebApp authentication');
    }
  };

  // Handle standalone Telegram login button response
  const handleTelegramResponse = async (response) => {
    try {
      console.log("Telegram login response:", response); // Log Telegram login response
      const result = await fetch("https://api.hashtagdigital.net/api/auth/telegram_auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });

      if (!result.ok) {
        throw new Error('Authentication failed');
      }

      const data = await result.json();
      console.log("Authentication response data:", data); // Log authentication response data
      if (data.user) {
        const userData = {
          id: data.user.id,
          username: `${data.user.first_name} ${data.user.last_name || ''}`.trim(),
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          photo_url: data.user.photo_url || "https://via.placeholder.com/50", // Default photo URL if none
          auth_date: data.user.auth_date
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
      }
    } catch (error) {
      console.error('Error during Telegram login:', error);
      setAuthError(error.message || "Authentication failed");
    }
  };

  useEffect(() => {
    const checkFarmingStatus = () => {
      const storedEndTime = localStorage.getItem('farmingEndTime');
      console.log("Farming end time from localStorage:", storedEndTime); // Log farming end time from localStorage
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
      console.log("Starting farming...");
      const response = await fetch('https://api.hashtagdigital.net/api/start-farming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration: 480 })
      });

      const data = await response.json();
      console.log("Farming start response:", data); // Log farming start response

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
            profilePhoto={user.photo_url} // Ensure the photo_url is passed correctly here
          />

          {!showBuyToken && (
            <>
              <ClaimSection
                onClaimClick={handleClaimClick}
                farmingEndTime={farmingEndTime}
              />
              <AvatarCard 
                profilePhoto={user.photo_url} // Ensure this prop is passed correctly
                username={user.username}
              />
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
