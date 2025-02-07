import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './../assets/styles/ClaimSection.css';

function ClaimSection({ farmingStatus }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [canClaim, setCanClaim] = useState(false);
  const [totalHTC, setTotalHTC] = useState(0);
  const [claimedAmount, setClaimedAmount] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [lastClaimTime, setLastClaimTime] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const authToken = storedUser?.token;

        if (!authToken) throw new Error('No auth token found');

        const response = await fetch('https://api.hashtagdigital.net/api/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch transaction history');

        const data = await response.json();
        const total = data.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        setTotalHTC(total);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let timer;

    const updateTimer = () => {
      const storedLastClaimTime = localStorage.getItem('lastClaimTime');

      if (storedLastClaimTime) {
        setLastClaimTime(new Date(parseInt(storedLastClaimTime)));
      }

      if (!farmingStatus.startTime || !farmingStatus.isActive) {
        setTimeLeft('08H:00M:00s');
        setCanClaim(false);
        return;
      }

      const startTime = new Date(farmingStatus.startTime);
      const now = new Date();
      const farmingDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
      const nextClaimTime = new Date(startTime.getTime() + farmingDuration);
      const diff = nextClaimTime - now;

      if (diff <= 0) {
        setTimeLeft('00H:00M:00s');
        setCanClaim(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}H:${minutes.toString().padStart(2, '0')}M:${seconds.toString().padStart(2, '0')}s`);
      setCanClaim(false);
    };

    timer = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(timer);
  }, [farmingStatus, lastClaimTime]);

  const handleClaim = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const authToken = storedUser?.token;

      if (!authToken) throw new Error('No auth token found');

      console.log('User Token:', authToken); // Print the token to the console

      const response = await fetch('https://api.hashtagdigital.net/api/claim-farming-rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to claim rewards');
      }

      const data = await response.json();
      const amount = data?.transaction?.amount || 1000;

      setClaimedAmount(amount);
      setShowReward(true);
      setCanClaim(false);

      // Store last claim time
      const claimTime = new Date().getTime();
      localStorage.setItem('lastClaimTime', claimTime);
      setLastClaimTime(new Date(claimTime));

      // Hide reward after 3 seconds
      setTimeout(() => {
        setShowReward(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert(`Failed to claim rewards: ${error.message}`);
    }
  };

  return (
    <div className="claim-section">
      {showReward && (
        <>
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            recycle={false} 
            numberOfPieces={200}
          />
          <div className="reward-popup animate-bounce">
            +{claimedAmount.toLocaleString()} $HTC
          </div>
        </>
      )}

      <div className="text-center">
        <h1 className="heading">
          {totalHTC.toLocaleString()} $HTC
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
            onClick={handleClaim}
          >
            Claim $HTC Now: <span className="highlight">1,000</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ClaimSection;
