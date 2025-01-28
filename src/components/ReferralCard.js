import React from 'react';
import { FaShareAlt } from 'react-icons/fa'; // Import new share icon

const ReferralCard = () => {
  const cardStyle = {
    background: 'linear-gradient(to bottom right, #e0f7ff, #a6c8ff)',
    margin: '1.5rem 0',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  };

  const iconContainerStyle = {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
  };

  const contentStyle = {
    marginTop: '2rem',
  };

  const referralTextStyle = {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '0.5rem', // Added space between count and total referrals text
  };

  const referralCountStyle = {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#1a3d73',
  };

  const totalReferralsStyle = {
    fontSize: '1.2rem',
    color: '#1a3d73',
    marginLeft: '0.25rem',
  };

  const bonusTextStyle = {
    marginTop: '0.5rem', // Added more space
    fontSize: '.9rem',
    fontWeight: '500',
    color: '#e91e63',
  };

  const buttonStyle = {
    marginTop: '1.5rem', // Increased top margin for better spacing
    backgroundColor: '#1a3d73',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '1.25rem',
    fontWeight: '500',
    fontSize: '1rem', // Slightly larger text
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.3s',
  };

  const avatarContainerStyle = {
    position: 'absolute',
    right: '.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
  };

  const avatarStyle = {
    width: '8.5rem',
    height: '8.5rem',
    borderRadius: '9999px',
    backgroundColor: '#f3e8ff',
    overflow: 'hidden',
  };

  const avatarImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <>
      <h2 className="title-ii" style={headingStyle}>Invite friends</h2>
      <div style={cardStyle}>
        {/* New Share icon in top-left */}
        <div style={iconContainerStyle}>
          <FaShareAlt className="text-blue-900" size={24} /> {/* Using FaShareAlt */}
        </div>

        {/* Main content */}
        <div style={contentStyle}>
          {/* Referral count */}
          <div style={referralTextStyle}>
            <span style={referralCountStyle}>24</span>
            <span style={totalReferralsStyle}>Total Referrals</span>
          </div>

          {/* Hashtag bonus text */}
          <div style={bonusTextStyle}>
            <span>+500 Hashtag per invite</span>
          </div>

          {/* Copy Link button */}
          <button style={buttonStyle}>
            Copy Link
          </button>

          {/* Avatar image */}
          <div style={avatarContainerStyle}>
            <div style={avatarStyle}>
              <img
                src={require('./../assets/user2.png')}
                alt="Avatar"
                style={avatarImageStyle}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const headingStyle = {
  fontSize: '16px', // Larger font size for the heading
  color: '#fff',
  marginBottom: '-22px', // Bottom margin to give space from the card
};

export default ReferralCard;
