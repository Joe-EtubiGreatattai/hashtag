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
  const [claimMessage, setClaimMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let confettiTimer;
    if (isConfettiActive) {
      confettiTimer = setTimeout(() => {
        setIsConfettiActive(false);
      }, 5000);
    }
    return () => clearTimeout(confettiTimer);
  }, [isConfettiActive]);

  const handleClaim = async () => {
    setIsLoading(true);
    setError('');
  
    try {
      const token = localStorage.getItem('authToken');
      console.log('Attempting to claim reward...');
      
      if (!token) {
        console.error('No auth token found in localStorage');
        throw new Error('Please log in again to claim your reward');
      }
  
      console.log('Making API request to claim reward...');
      const response = await fetch('https://api.hashtagdigital.net/api/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
  
      if (response.status === 401) {
        console.error('Authentication failed - token invalid or expired');
        localStorage.removeItem('authToken'); // Clear invalid token
        localStorage.removeItem('userData');
        window.location.reload(); // Force re-authentication
        throw new Error('Session expired. Please log in again.');
      }
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to claim reward');
      }
  
      console.log('Claim successful:', data.message);
      setClaimMessage(data.message);
      
      if (!data.message.includes('already claimed')) {
        setIsClaimed(true);
        setIsConfettiActive(true);
      }
    } catch (err) {
      console.error('Claim error:', err);
      setError(err.message || 'Failed to claim reward. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          {error && <div className="error-message">{error}</div>}
          {claimMessage && <div className="claim-message">{claimMessage}</div>}
          
          {isClaimed ? (
            <div className="claimed-text">Claimed: +500 $HTC</div>
          ) : (
            <button 
              onClick={handleClaim}
              className="claim-button"
              disabled={isLoading || isClaimed}
            >
              {isLoading ? 'Claiming...' : 'Claim +500 $HTC'}
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