import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Confetti from 'react-confetti';
import '../assets/styles/RewardModal.css';
import { getAuthToken, removeAuthToken } from '../config';

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
  const [lastClaimDate, setLastClaimDate] = useState(null);

  useEffect(() => {
    const fetchLastClaimDate = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No auth token found');
        }

        const response = await fetch('https://api.hashtagdigital.net/api/fetch-last-daily-bonus', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          removeAuthToken();
          localStorage.removeItem('userData');
          window.location.reload();
          throw new Error('Session expired. Please log in again.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch last claim date');
        }

        const data = await response.json();
        setLastClaimDate(new Date(data.lastDate));
      } catch (err) {
        console.error('Error fetching last claim date:', err);
        setError(err.message);
      }
    };

    fetchLastClaimDate();
  }, []);

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
    if (!lastClaimDate) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const nextClaimTime = new Date(lastClaimDate);
      nextClaimTime.setHours(nextClaimTime.getHours() + 24); // Set next claim time to 24 hours after last claim

      const diffInSeconds = Math.floor((nextClaimTime - now) / 1000);
      
      if (diffInSeconds <= 0) {
        setTimeLeft(0);
        setIsClaimed(false);
      } else {
        setTimeLeft(diffInSeconds);
        setIsClaimed(true);
      }
    };

    const timer = setInterval(updateTimeLeft, 1000);
    updateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, [lastClaimDate]);

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
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Please log in again to claim your reward');
      }
  
      const response = await fetch('https://api.hashtagdigital.net/api/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (response.status === 401) {
        removeAuthToken();
        localStorage.removeItem('userData');
        window.location.reload();
        throw new Error('Session expired. Please log in again.');
      }
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to claim reward');
      }
  
      setClaimMessage(data.message);
      setLastClaimDate(new Date(data.currentDate)); // Update last claim date
      setIsClaimed(true);
      setIsConfettiActive(true);
      
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
          
          {timeLeft === 0 ? (
            <button 
              onClick={handleClaim}
              className="claim-button"
              disabled={isLoading}
            >
              {isLoading ? 'Claiming...' : 'Claim +500 $HTC'}
            </button>
          ) : (
            <div className="claimed-text">Claimed: +500 $HTC</div>
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