import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Confetti from 'react-confetti';
import '../assets/styles/RewardModal.css';

const RewardModal = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(86397);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Stop confetti after 5 seconds
  useEffect(() => {
    let confettiTimer;
    if (isConfettiActive) {
      confettiTimer = setTimeout(() => {
        setIsConfettiActive(false);
      }, 5000);
    }
    return () => clearTimeout(confettiTimer);
  }, [isConfettiActive]);

  const handleClaim = () => {
    setIsClaimed(true);
    setIsConfettiActive(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay">
      {isConfettiActive && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          colors={['#FFD700', '#FFA500', '#FF6347', '#87CEEB', '#98FB98']}
        />
      )}
      
      <div className="modal-container">
        <button onClick={onClose} className="close-button">
          <X className="close-icon" />
        </button>

        <h1 className="modal-title">Your Reward</h1>

        <div className="claim-amount">
          {isClaimed ? (
            <div className="claimed-text">Claimed: +500 $HTC</div>
          ) : (
            <button 
              onClick={handleClaim}
              className="claim-button"
              disabled={isClaimed}
            >
              Claim +500 $HTC
            </button>
          )}
        </div>

        <div className="next-claim">
          Next Claim : {formatTime(timeLeft)}
        </div>

        <div className="reward-info">
          <div className="double-reward">2X Reward</div>
          <div className="tomorrow">TOMORROW</div>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;