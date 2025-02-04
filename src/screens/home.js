import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from '../components/Header';
import AvatarCard from '../components/AvatarCard';
import RewardModal from '../components/RewardModal';
import ClaimSection from '../components/ClaimSection';
import GamifySystemCard from "../components/GamifySystemCard";
import BuyTokenComponent from '../components/BuyTokenComponent';
import BottomSpacer from '../components/BottomSpacer';
import AuthComponent from '../components/AuthComponent';

const App = () => {
  const [showBuyToken, setShowBuyToken] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [farmingEndTime, setFarmingEndTime] = useState(null);
  const [farmingError, setFarmingError] = useState(null);


  useEffect(() => {
    const checkFarmingStatus = () => {
      const storedEndTime = localStorage.getItem('farmingEndTime');
      if (storedEndTime) {
        const endTime = new Date(storedEndTime);
        const now = new Date();
        
        if (endTime > now) {
          // Farming is still active
          setFarmingEndTime(storedEndTime);
        } else {
          // Farming has ended, clear storage
          localStorage.removeItem('farmingEndTime');
          setFarmingEndTime(null);
        }
      }
    };

    checkFarmingStatus();
  }, []);


  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication status...');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        console.log('No auth token found');
        setIsAuthenticated(false);
        return;
      }

      try {
        // Validate token with backend
        console.log('Validating token with backend...');
        const response = await fetch('https://api.hashtagdigital.net/api/validate-token', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          console.error('Token validation failed:', response.status);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
          return;
        }

        console.log('Token validated successfully');
        setIsAuthenticated(true);

        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          console.log('Retrieved user data:', parsedUserData);
          setUserData(parsedUserData);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (data) => {
    console.log('Authentication successful:', data);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', data.token);
    if (data.user) {
      console.log('Storing user data:', data.user);
      setUserData(data.user);
      localStorage.setItem('userData', JSON.stringify(data.user));
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
  };

  const handleBuyHTCClick = () => {
    setShowBuyToken(true);
  };

  const handleClaimClick = () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, cannot claim reward');
      return;
    }
    setShowRewardModal(true);
  };

  const handleBackFromBuy = () => {
    setShowBuyToken(false);
  };

  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
  };

   const handleStartFarming = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, cannot start farming');
      return;
    }

    try {
      setFarmingError(null);
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('https://api.hashtagdigital.net/api/start-farming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
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


  if (!isAuthenticated) {
    console.log('Rendering auth component...');
    return (
      <div className="appII">
        <AuthComponent onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="appII">
      <Header
        username={userData?.username || "User"}
        level="LV 1"
        profilePhoto="https://via.placeholder.com/50"
        onLogout={handleLogout}
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