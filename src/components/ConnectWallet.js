import React, { useEffect, useState } from 'react';
import { TonConnect } from '@tonconnect/sdk';

const tonConnect = new TonConnect({
  manifestUrl: 'https://api.hashtagdigital.net/tonconnect-manifest.json',
});

const ConnectWallet = ({ onConnect }) => {
  const connectWallet = async () => {
    try {
      // Get available wallets
      const wallets = await tonConnect.getWallets();
      console.log('Available wallets:', wallets);

      // Connect to the first available wallet
      if (wallets.length > 0) {
        // Create universal link for the first wallet
        const universalLink = tonConnect.connect({
          universalUrl: wallets[0].universalUrl,
          bridgeUrl: wallets[0].bridgeUrl
        });
        
        console.log('Connection details:', {
          wallet: wallets[0].name,
          universalLink
        });

        // Listen for connection status
        tonConnect.onStatusChange((wallet) => {
          if (wallet) {
            console.log('Connected wallet:', wallet);
            onConnect(wallet);
          }
        });
      } else {
        console.log('No wallets available');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={connectWallet}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWallet;