import React from 'react';
import { FaShareAlt } from 'react-icons/fa';

const ReferralCard = ({ showHeader = true }) => {
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
    marginBottom: '0.5rem',
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
    marginTop: '0.5rem',
    fontSize: '.9rem',
    fontWeight: '500',
    color: '#e91e63',
  };

  const buttonStyle = {
    marginTop: '1.5rem',
    backgroundColor: '#1a3d73',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '1.25rem',
    fontWeight: '500',
    fontSize: '1rem',
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

  const headingStyle = {
    fontSize: '16px',
    color: '#fff',
    marginBottom: '-22px',
  };

  return (
    <>
      {showHeader && <h2 className="title-ii" style={headingStyle}>Invite friends</h2>}
      <div style={cardStyle}>
        <div style={iconContainerStyle}>
          <FaShareAlt className="text-blue-900" size={24} />
        </div>

        <div style={contentStyle}>
          <div style={referralTextStyle}>
            <span style={referralCountStyle}>24</span>
            <span style={totalReferralsStyle}>Total Referrals</span>
          </div>

          <div style={bonusTextStyle}>
            <span>+500 Hashtag per invite</span>
          </div>

          <button style={buttonStyle}>
            Copy Link
          </button>

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

export default ReferralCard;