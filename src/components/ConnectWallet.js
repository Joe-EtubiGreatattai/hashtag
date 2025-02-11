import React, { useEffect, useState } from 'react';
import { TonConnect } from '@tonconnect/sdk';

const tonConnect = new TonConnect({
  manifestUrl: 'https://hashtag-weld.vercel.app/tonconnect-manifest.json', // Update with your hosted manifest
});

const ConnectWallet = ({ onConnect }) => {
  const [wallet, setWallet] = useState(null);
  
  useEffect(() => {
    tonConnect.restoreConnection().then(() => {
      setWallet(tonConnect.wallet);
    });

    tonConnect.onStatusChange((newWallet) => {
      setWallet(newWallet);
      if (onConnect) onConnect(newWallet);
    });
  }, []);

  const handleConnect = async () => {
    try {
      const wallets = await tonConnect.getWallets();
      if (wallets.length > 0) {
        const link = tonConnect.connect(wallets[0]);
        window.open(link, '_blank');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const sendTransaction = async (amountTon) => {
    if (!wallet) {
      console.log('User is not connected to a wallet.');
      return;
    }

    const transaction = {
      messages: [
        {
          address: 'UQBGkp2FPQcMq0hjxct1Zn9DpOsQKx_FIr70QYUk7DuoTH1X', // Replace with your TON wallet address
          amount: (amountTon * 1e9).toString(), // Convert TON to nanotons
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
      {wallet ? (
        <p>Connected: {wallet.name}</p>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
