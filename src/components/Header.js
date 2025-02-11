// Header.js
import React from 'react';
import logo from '../assets/logo.png';

const Header = ({ 
  username, 
  level, 
  profilePhoto, 
  onConnectWallet, 
  onDisconnectWallet,
  walletConnected, 
  walletInfo 
}) => {
  const getDisplayAddress = () => {
    if (!walletInfo?.account?.address) return '';
    const addr = walletInfo.account.address;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      <div style={styles.header}>
        <div style={styles.profileContainer}>
          <img
            src={require('../assets/user.png')}
            alt="Profile"
            style={styles.profilePhoto}
          />
          <div style={styles.textContainer}>
            <span style={styles.username}>{username}</span>
            {walletConnected && walletInfo && (
              <span style={styles.walletAddress}>{getDisplayAddress()}</span>
            )}
          </div>
        </div>

        <button 
          style={{
            ...styles.connect,
            backgroundColor: walletConnected ? '#dc2626' : '#2563eb',
            transition: 'background-color 0.3s ease'
          }} 
          onClick={walletConnected ? onDisconnectWallet : onConnectWallet}
        >
          {walletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>
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
    gap: '0px',
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
    padding: '1px 20px',
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
  walletAddress: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px',
  },
  connect: {
    fontSize: '14px',
    color: '#fff',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    hover: {
      opacity: 0.9,
    }
  },
};

export default Header;