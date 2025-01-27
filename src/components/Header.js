import React from 'react';
import logo from '../assets/logo.png'; // Import the logo image

const Header = ({ username, level, profilePhoto }) => {
  return (
    <div style={styles.container}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.profileContainer}>
          <img
            src={require('../assets/user.png')}
            alt="Profile"
            style={styles.profilePhoto}
          />
          <div style={styles.textContainer}>
            <span style={styles.username}>{username}</span>
            <span style={styles.level}>{level}</span>
          </div>
        </div>

        <button style={styles.connect}>Connect Wallet</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px', // Space between logo and header
  },
  logoContainer: {
    textAlign: 'center',
  },
  logo: {
    width: '103px',
    height: 'auto',
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 30px',
    borderRadius: '8px',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  profilePhoto: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  level: {
    fontSize: '16px',
    color: '#fff', // Gray color
  },
  connect: {
    fontSize: '14px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Header;
