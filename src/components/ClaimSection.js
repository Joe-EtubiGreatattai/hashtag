import React, { useState, useEffect } from 'react';
import './../assets/styles/ClaimSection.css';

function ClaimSection({ onClaimClick, farmingStatus }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    let timer;
    
    const updateTimer = () => {
      if (!farmingStatus.startTime || !farmingStatus.isActive) {
        setTimeLeft('8H:00M:00s');
        setCanClaim(false);
        return;
      }

      const startTime = new Date(farmingStatus.startTime);
      const now = new Date();
      const farmingDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
      const endTime = new Date(startTime.getTime() + farmingDuration);
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft('0H:00M:00s');
        setCanClaim(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}H:${minutes.toString().padStart(2, '0')}M:${seconds.toString().padStart(2, '0')}s`);
      setCanClaim(false);
    };

    timer = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(timer);
  }, [farmingStatus]);

  return (
    <div className="claim-section">
      <div className="text-center">
        <h1 className="heading">
          450,000 $HTC
        </h1>
        <p className="time-text">{timeLeft}</p>
        {farmingStatus.isActive && (
          <p className="text-green-500 text-sm mt-1">Farming in progress...</p>
        )}
      </div>

      {canClaim && (
        <div className="button-container">
          <button 
            className="claim-button" 
            onClick={onClaimClick}
          >
            Claim $HTC Now: <span className="highlight">1000</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ClaimSection;