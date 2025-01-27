import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../assets/styles/RewardModal.css'; // Import the CSS file

const RewardModal = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(86397); // 23:59:57 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={onClose} className="close-button">
          <X className="close-icon" />
        </button>

        <h1 className="modal-title">Your Reward</h1>

        <div className="claim-amount">
          Claim : +500 $HTC
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
