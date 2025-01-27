import React, { useState } from 'react';
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

  const handleBuyHTCClick = () => {
    setShowBuyToken(true); // Hide other components and show BuyTokenComponent
  };

  const handleClaimClick = () => {
    setShowRewardModal(true); // Show RewardModal
  };
  const handleBackFromBuy = () => {
    setShowBuyToken(false);
  };
  const handleCloseRewardModal = () => {
    setShowRewardModal(false); // Hide RewardModal
  };

  return (
    <div className="app">
      <Header
        username="slackecy"
        level="LV 1"
        profilePhoto="https://via.placeholder.com/50"
      />
      {/* Conditionally render AvatarCard and GamifySystemCard */}
      {!showBuyToken && (
        <>
          <ClaimSection onClaimClick={handleClaimClick} />
          <AvatarCard />
          <GamifySystemCard
            title=""
            cardText="Claim Your"
            buttonLabel="Daily Bonus"
            onButtonClick={handleClaimClick} // Pass the handler for Daily Bonus
            button1Label="Start Farming"
            button2Label="Buy $HTC"
            onButton1Click={() => alert('Start Farming button clicked!')}
            onButton2Click={handleBuyHTCClick} // Use the handler for Button 2
          />
        </>
      )}

      {/* Conditionally render BuyTokenComponent */}
      {showBuyToken &&  <BuyTokenComponent onBack={handleBackFromBuy} />}
      {/* Conditionally render RewardModal */}
      {showRewardModal && <RewardModal onClose={handleCloseRewardModal} />}

      <BottomSpacer />
    </div>
  );
};

export default App;