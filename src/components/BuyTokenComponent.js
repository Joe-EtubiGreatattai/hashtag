import React, { useState } from 'react';
import FixedLogo from './fixedLogo';

const BuyTokenComponent = () => {
  const [activeTab, setActiveTab] = useState('ton');
  const [tonAmount, setTonAmount] = useState('');
  const [htcAmount, setHtcAmount] = useState('');

  const handleBuy = () => {
    console.log('Buying tokens:', { tonAmount, htcAmount });
  };

  const getInputLabels = () => {
    if (activeTab === 'ton') {
      return {
        tonLabel: 'Enter amount in TON',
        htcLabel: 'Amount in $HTC',
        tonPlaceholder: '0.0',
        htcPlaceholder: '0.0',
        tonSuffix: 'TON',
        htcSuffix: '$HTC',
      };
    } else if (activeTab === 'stars') {
      return {
        tonLabel: 'Enter amount in Stars',
        htcLabel: 'Amount in $HTC',
        tonPlaceholder: '0.0',
        htcPlaceholder: '0.0',
        tonSuffix: 'Stars',
        htcSuffix: '$HTC',
      };
    }
    return {};
  };

  const { tonLabel, htcLabel, tonPlaceholder, htcPlaceholder, tonSuffix, htcSuffix } = getInputLabels();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Balance: <span>10 $HTC</span>
      </h2>
      
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === 'ton' ? 'black' : 'transparent',
            color: activeTab === 'ton' ? 'white' : 'white',
          }}
          onClick={() => setActiveTab('ton')}
        >
          Buy with TON
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === 'stars' ? 'black' : 'transparent',
            color: activeTab === 'stars' ? 'white' : 'white',
          }}
          onClick={() => setActiveTab('stars')}
        >
          Buy with Stars
        </button>
      </div>

      <div style={styles.formContainer}>
        <div>
          <label style={styles.label}>{tonLabel}</label>
          <div style={styles.inputContainer}>
            <input
              type="number"
              value={tonAmount}
              onChange={(e) => setTonAmount(e.target.value)}
              style={styles.input}
              placeholder={tonPlaceholder}
            />
            <span style={styles.inputSuffix}>{tonSuffix}</span>
          </div>
        </div>

        <div>
          <label style={styles.label}>{htcLabel}</label>
          <div style={styles.inputContainer}>
            <input
              type="number"
              value={htcAmount}
              onChange={(e) => setHtcAmount(e.target.value)}
              style={styles.input}
              placeholder={htcPlaceholder}
            />
            <span style={styles.inputSuffix}>{htcSuffix}</span>
          </div>
        </div>

        <button
          onClick={handleBuy}
          style={styles.buyButton}
        >
          BUY
        </button>
      </div>
      <FixedLogo/>
    </div>
  );
};

const styles = {
  container: {
    color: 'white',
    borderRadius: '8px',
    maxWidth: '90vw',
    margin: 'auto',
    padding: '24px', // Added padding for spacing
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '24px',
    marginBottom: '24px',
    background: 'linear-gradient(86.92deg, #FFCFF1 19.67%, #00F2EA 96.33%)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  },
  tabContainer: {
    display: 'flex',
    marginBottom: '32px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '50px',
    padding: '4px',
    width: '90vw',
  },
  tabButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s, color 0.3s',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    maxWidth: '500px',
  },
  label: {
    fontSize: '18px',
    marginBottom: '8px',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: '16px',
    fontSize: '16px',
    borderRadius: '16px',
    color: 'black',
    paddingRight: '60px',
  },
  inputSuffix: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'black',
    fontSize: '16px',
  },
  buyButton: {
    width: '100%',
    backgroundColor: 'black',
    color: 'white',
    padding: '16px',
    borderRadius: '16px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default BuyTokenComponent;
