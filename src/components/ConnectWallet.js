import React, { useState, useEffect } from 'react';
import { TonConnect } from '@tonconnect/sdk';
import { Loader2, Smartphone, Desktop } from 'lucide-react';

const tonConnect = new TonConnect({
  manifestUrl: 'https://api.hashtagdigital.net/tonconnect-manifest.json',
});

const ConnectWallet = ({ onConnect }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connectionUrl, setConnectionUrl] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    };
    setIsMobile(checkMobile());
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const availableWallets = await tonConnect.getWallets();
      setWallets(availableWallets);
      
      tonConnect.onStatusChange((wallet) => {
        if (wallet) {
          console.log('Connected wallet:', wallet);
          onConnect(wallet);
        }
      });
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
    
    setConnectionUrl(universalLink);

    // Handle connection based on platform
    if (isMobile) {
      // For mobile, try to open the wallet app directly
      window.location.href = universalLink;
    } else {
      // For desktop, show QR code and universal link
      if (wallet.injected) {
        // If wallet has browser extension
        try {
          await wallet.connect();
        } catch (error) {
          console.error('Extension connection failed:', error);
        }
      }
    }
  };

  const getUniversalLinkDisplay = () => {
    if (!connectionUrl) return null;
    return connectionUrl.substring(0, 50) + '...';
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
          <h2 className="text-lg font-bold text-center mb-4">
            {isMobile ? 
              <div className="flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5" />
                Select Mobile Wallet
              </div> :
              <div className="flex items-center justify-center gap-2">
                <Desktop className="w-5 h-5" />
                Select Desktop Wallet
              </div>
            }
          </h2>
          
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
                <div className="text-left flex-1">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm text-gray-500">{wallet.appName}</div>
                </div>
                {selectedWallet?.name === wallet.name && (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                )}
              </button>
            ))}
          </div>

          {connectionUrl && !isMobile && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-2">Connection Link:</h3>
              <div className="text-sm break-all text-gray-600">
                {getUniversalLinkDisplay()}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Please open this link in your wallet app or scan the QR code if available.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;