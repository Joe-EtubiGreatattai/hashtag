import React from 'react';
import './../assets/styles/ClaimSection.css'; // Import the CSS file

function ClaimSection({ onClaimClick }) {
  return (
    <div className="claim-section">
      <div className="text-center">
        <h1 className="heading">
          450,000 $HTC
        </h1>
        <p className="time-text">8H:00M:00s</p>
      </div>

      <div className="button-container">
        <button className="claim-button" onClick={onClaimClick}>
          Claim $HTC Now: <span className="highlight">1000</span>
        </button>
      </div>
    </div>
  );
}

export default ClaimSection;
