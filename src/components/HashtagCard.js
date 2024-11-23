import React from 'react';
import '../assets/styles/HashtagCard.css';
import coinIcon from '../assets/ninja.png'; // Add your coin icon image file here

const HashtagCard = ({ hashtag, dailyBonusText }) => {
  return (
    <div className="hashtag-card">
      <div className="hashtag-content">
        <div className="hashtag-info">
          <img src={coinIcon} alt="Coin Icon" className="coin-icon" />
          <div className="hashtag-text">
            <span className="hashtag-label">your hashtag</span>
            <span className="hashtag-value">{hashtag}</span>
          </div>
        </div>
        <button className="daily-bonus-button">{dailyBonusText}</button>
      </div>
    </div>
  );
};

export default HashtagCard;
