import React from 'react';
import { X } from 'lucide-react';
import '../assets/styles/BoostModal.css'; // Import the CSS for styling

const BoostModal = ({ onClose, booster }) => {
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

        <div className="boost-modal-buttons">
          <button className="boost-modal-button boost-htc-button">
            Boost with 50,000 $HTC
          </button>

          <button className="boost-modal-button boost-ton-button">
            Boost with 0.2 TON
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoostModal;