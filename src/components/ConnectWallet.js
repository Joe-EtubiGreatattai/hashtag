import React, { useState } from 'react';
import { TonConnect } from '@tonconnect/sdk';
import { Loader2 } from 'lucide-react';

const tonConnect = new TonConnect({
  manifestUrl: 'https://api.hashtagdigital.net/tonconnect-manifest.json',
});

const ConnectWallet = ({ onConnect }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const availableWallets = await tonConnect.getWallets();
      setWallets(availableWallets);
      
      if (availableWallets.length > 0) {
        // Listen for connection status
        tonConnect.onStatusChange((wallet) => {
          if (wallet) {
            console.log('Connected wallet:', wallet);
            onConnect(wallet);
          }
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletSelect = async (wallet) => {
    setSelectedWallet(wallet);
    const universalLink = tonConnect.connect({
      universalUrl: wallet.universalUrl,
      bridgeUrl: wallet.bridgeUrl
    });
    
    console.log('Connection details:', {
      wallet: wallet.name,
      universalLink
    });
    
    // You might want to handle the universal link here
    // For example, redirect or show a QR code
    window.location.href = universalLink;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {!wallets.length && (
        <button 
          onClick={connectWallet}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading Wallets...
            </>
          ) : (
            'Connect Wallet'
          )}
        </button>
      )}

      {wallets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-center mb-4">Select a Wallet</h2>
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {wallets.map((wallet, index) => (
              <button
                key={index}
                onClick={() => handleWalletSelect(wallet)}
                className={`w-full p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors
                  ${selectedWallet?.name === wallet.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <img 
                  src={wallet.imageUrl} 
                  alt={wallet.name}
                  className="w-8 h-8 object-contain"
                />
                <div className="text-left">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm text-gray-500">{wallet.appName}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;