import React from 'react';
import './../assets/styles/ClaimSection.css';

function ClaimSection({ onClaimClick, farmingEndTime }) {
  const [timeLeft, setTimeLeft] = React.useState('');
  const [isFarmingActive, setIsFarmingActive] = React.useState(false);

  React.useEffect(() => {
    let timer;
    
    const updateTimer = () => {
      if (!farmingEndTime) {
        setTimeLeft('8H:00M:00s');
        setIsFarmingActive(false);
        return;
      }

      const end = new Date(farmingEndTime);
      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('0H:00M:00s');
        setIsFarmingActive(false);
        localStorage.removeItem('farmingEndTime');
        return;
      }

      setIsFarmingActive(true);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}H:${minutes.toString().padStart(2, '0')}M:${seconds.toString().padStart(2, '0')}s`);
    };

    timer = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(timer);
  }, [farmingEndTime]);

  return (
    <div className="claim-section">
      <div className="text-center">
        <h1 className="heading">
          450,000 $HTC
        </h1>
        <p className="time-text">{timeLeft}</p>
        {isFarmingActive && (
          <p className="text-green-500 text-sm mt-1">Farming in progress...</p>
        )}
      </div>

      <div className="button-container">
        <button 
          className="claim-button" 
          onClick={onClaimClick}
          disabled={!isFarmingActive}
        >
          Claim $HTC Now: <span className="highlight">1000</span>
        </button>
      </div>
    </div>
  );
}

export default ClaimSection;