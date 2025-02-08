import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../assets/styles/BoostModal.css';

const BoostModal = ({ onClose, booster, onActivate, isActivating }) => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleHTCBoost = async () => {
    setError('');
    setSuccessMessage('');
    
    const result = await onActivate(booster.id, 'htc');
    
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(onClose, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="boost-modal-overlay">
      <div className="boost-modal">
        <button onClick={onClose} className="close-button">
          <X className="close-icon" />
        </button>

        <h1 className="boost-modal-title">{booster?.title}</h1>

        <p className="boost-modal-description">
          Activate {booster?.title} to Increase your farming rate and earn more rewards. Instantly earn {booster?.text}.
        </p>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="boost-modal-buttons">
          <button 
            className="boost-modal-button boost-htc-button"
            onClick={handleHTCBoost}
            disabled={isActivating}
          >
            {isActivating ? 'Activating...' : `Boost with ${booster?.htc} $HTC`}
          </button>
          <button className="boost-modal-button boost-star-button" disabled>
            Boost with {booster?.starPrice} Stars ⭐
          </button>
          <button className="boost-modal-button boost-ton-button" disabled>
            Boost with {booster?.tonPrice} TON
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoostModal;