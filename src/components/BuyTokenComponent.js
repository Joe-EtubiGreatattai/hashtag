import React, { useState } from 'react';
import FixedLogo from './fixedLogo';

const BuyTokenComponent = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('ton');
  const [tonAmount, setTonAmount] = useState('');
  const [htcAmount, setHtcAmount] = useState('');
  const HTC_PRICE = 0.35;

  const handleTonChange = (value) => {
    setTonAmount(value);
    if (value && !isNaN(value)) {
      setHtcAmount((parseFloat(value) / HTC_PRICE).toFixed(2));
    } else {
      setHtcAmount('');
    }
  };

  const handleHtcChange = (value) => {
    setHtcAmount(value);
    if (value && !isNaN(value)) {
      setTonAmount((parseFloat(value) * HTC_PRICE).toFixed(2));
    } else {
      setTonAmount('');
    }
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

  const handleBuy = () => {
    console.log('Buying tokens:', { tonAmount, htcAmount }); // Log the values
    alert(`Buying ${htcAmount} $HTC for ${tonAmount} ${activeTab === 'ton' ? 'TON' : 'Stars'}`); // Optional: Show an alert
  };

  const { tonLabel, htcLabel, tonPlaceholder, htcPlaceholder, tonSuffix, htcSuffix } = getInputLabels();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← 
        </button>
        <h2 style={styles.title}>
          Balance: <span>10 $HTC</span>
        </h2>
      </div>
      
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === 'ton' ? 'black' : 'transparent',
            color: 'white',
          }}
          onClick={() => setActiveTab('ton')}
        >
          Buy with TON
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === 'stars' ? 'black' : 'transparent',
            color: 'white',
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
              onChange={(e) => handleTonChange(e.target.value)}
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
              onChange={(e) => handleHtcChange(e.target.value)}
              style={styles.input}
              placeholder={htcPlaceholder}
            />
            <span style={styles.inputSuffix}>{htcSuffix}</span>
          </div>
        </div>

        <button onClick={handleBuy} style={styles.buyButton}>
          BUY
        </button>
      </div>
      <FixedLogo top='68%'/>
    </div>
  );
};

const styles = {
  container: {
    color: 'white',
    borderRadius: '8px',
    maxWidth: '90vw',
    margin: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px',
    marginRight: '16px',
  },
  title: {
    fontSize: '24px',
    background: 'linear-gradient(86.92deg, #FFCFF1 19.67%, #00F2EA 96.33%)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    margin: 0,
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
    border: 'none',
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
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: '16px',
    fontSize: '16px',
    border: 'none',
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
    pointerEvents: 'none',
  },
  buyButton: {
    width: '100%',
    backgroundColor: 'black',
    color: 'white',
    padding: '16px',
    border: 'none',
    borderRadius: '16px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default BuyTokenComponent;