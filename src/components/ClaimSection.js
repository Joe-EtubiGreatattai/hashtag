import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './../assets/styles/ClaimSection.css';

function ClaimSection({ farmingStatus }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [totalHTC, setTotalHTC] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [lastClaimTime, setLastClaimTime] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const authToken = storedUser?.token;

        if (!authToken) throw new Error('No auth token found');

        const response = await fetch('https://api.hashtagdigital.net/api/transaction-history', {
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

    const updateFarmingStatus = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const authToken = storedUser?.token;

        if (!authToken) throw new Error('No auth token found');

        const response = await fetch('https://api.hashtagdigital.net/api/change-farming-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to update farming status');
        }

        const data = await response.json();
        if (data.success) {
          setShowReward(true);
          setTimeout(() => {
            setShowReward(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error updating farming status:', error);
      }
    };

    const updateTimer = () => {
      const storedLastClaimTime = localStorage.getItem('lastClaimTime');

      if (storedLastClaimTime) {
        setLastClaimTime(new Date(parseInt(storedLastClaimTime)));
      }

      if (!farmingStatus.startTime || !farmingStatus.isActive) {
        setTimeLeft('08H:00M:00s');
        return;
      }

      const startTime = new Date(farmingStatus.startTime);
      const now = new Date();
      const farmingDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
      const nextClaimTime = new Date(startTime.getTime() + farmingDuration);
      const diff = nextClaimTime - now;

      if (diff <= 0) {
        setTimeLeft('00H:00M:00s');
        updateFarmingStatus(); // Automatically update farming status when timer completes
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}H:${minutes.toString().padStart(2, '0')}M:${seconds.toString().padStart(2, '0')}s`);
    };

    timer = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(timer);
  }, [farmingStatus, lastClaimTime]);

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
            +1,000 $HTC
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
    </div>
  );
}

export default ClaimSection;