import React from 'react';
import logo from '../assets/logo.png';

const Header = ({ username, level, profilePhoto, onConnectWallet, walletConnected, setWalletConnected }) => {
  
  const disconnectWallet = () => {
    localStorage.removeItem('connectedWallet'); // Remove wallet from storage
    setWalletConnected(false);
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
          </div>
        </div>

        {/* Wallet Connect Button */}
        <button 
          style={styles.connect} 
          onClick={walletConnected ? disconnectWallet : onConnectWallet}
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
  connect: {
    fontSize: '14px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'blue',
  },
};

export default Header;
