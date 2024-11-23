import React, { useState, useEffect } from 'react';

const TimerProgress = ({ onTimeComplete }) => {
  const TOTAL_TIME = 8 * 60 * 60; // 8 hours in seconds
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [isActive, setIsActive] = useState(true);

  // Reset timer function
  const resetTimer = () => {
    setTimeRemaining(TOTAL_TIME);
    setIsActive(true);
  };

  // Update timeRemaining every second
  useEffect(() => {
    let interval;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (onTimeComplete) onTimeComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, onTimeComplete]);

  // Calculate progress percentage
  const progressPercentage = ((TOTAL_TIME - timeRemaining) / TOTAL_TIME) * 100;

  // Convert seconds to HH:MM:SS format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}H: ${minutes}M: ${secs}S`;
  };

  return (
    <div className="w-[90%] mx-auto text-center">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-white text-base font-bold ml-10">
          {formatTime(timeRemaining)}
        </span>
        <span className="text-white text-base font-bold mr-10">
          TAP
        </span>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-md overflow-hidden relative">
        <div
          className="h-full bg-[#002681] transition-[width] duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default TimerProgress;