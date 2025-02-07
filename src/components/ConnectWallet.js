import React, { useEffect, useState } from 'react';
import { TonConnect } from '@tonconnect/sdk';

const tonConnect = new TonConnect({
  manifestUrl: 'https://yourapp.com/tonconnect-manifest.json',
});

const ConnectWallet = ({ onConnect }) => {
  const [account, setAccount] = useState(null);
  
  useEffect(() => {
    tonConnect.restoreConnection().then(() => {
      setAccount(tonConnect.account);
    });
  }, []);

  const handleConnect = async () => {
    try {
      await tonConnect.connectWallet();
      setAccount(tonConnect.account);
      if (onConnect) onConnect(tonConnect.account);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const sendPaymentRequest = async (amountTon) => {
    if (!account) {
      console.log('User is not connected to a wallet.');
      return;
    }

    const myWalletAddress = 'EQDSF8K7...'; // Replace with your TON wallet address
    const amountNanoTon = (amountTon * 1e9).toString();

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300, // Expires in 5 minutes
      messages: [
        {
          address: myWalletAddress,
          amount: amountNanoTon,
        }
      ]
    };

    try {
      const result = await tonConnect.sendTransaction(transaction);
      console.log('Transaction sent:', result);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div>
      {account ? (
        <p>Connected: {account.address}</p>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
