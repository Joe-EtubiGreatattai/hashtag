import React, { useState, useEffect } from 'react';
import { TonConnect } from '@tonconnect/sdk';
import { Loader2, Smartphone, Monitor, AlertCircle } from 'lucide-react';

// Fallback wallet list in case the remote fetch fails
const FALLBACK_WALLETS = [
  {
    name: "Tonkeeper",
    appName: "Tonkeeper",
    imageUrl: "https://tonkeeper.com/assets/tonkeeper-logo.png",
    universalUrl: "https://app.tonkeeper.com/ton-connect",
    bridgeUrl: "https://bridge.tonapi.io/bridge"
  },
  {
    name: "MyTonWallet",
    appName: "MyTonWallet",
    imageUrl: "https://mytonwallet.io/icon-256.png",
    universalUrl: "https://connect.mytonwallet.org",
    bridgeUrl: "https://connect.mytonwallet.org/bridge"
  }
];

const tonConnect = new TonConnect({
  manifestUrl: 'https://api.hashtagdigital.net/tonconnect-manifest.json',
});

const ConnectWallet = ({ onConnect }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connectionUrl, setConnectionUrl] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    };
    setIsMobile(checkMobile());
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timeout to the wallet fetch
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 5000)
      );
      
      const walletPromise = tonConnect.getWallets();
      const availableWallets = await Promise.race([walletPromise, timeoutPromise])
        .catch(error => {
          console.warn('Failed to fetch wallets list, using fallback:', error);
          return FALLBACK_WALLETS;
        });

      setWallets(availableWallets);
      
      tonConnect.onStatusChange((wallet) => {
        if (wallet) {
          console.log('Connected wallet:', wallet);
          onConnect(wallet);
        }
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to initialize wallet connection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletSelect = async (wallet) => {
    try {
      setSelectedWallet(wallet);
      setError(null);
      
      const universalLink = tonConnect.connect({
        universalUrl: wallet.universalUrl,
        bridgeUrl: wallet.bridgeUrl
      });
      
      setConnectionUrl(universalLink);

      if (isMobile) {
        // For mobile, try to open the wallet app directly
        window.location.href = universalLink;
      } else if (wallet.injected) {
        try {
          await wallet.connect();
        } catch (error) {
          setError('Failed to connect to wallet extension. Please make sure it\'s installed and try again.');
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError('Failed to connect to wallet. Please try again.');
      setSelectedWallet(null);
    }
  };

  const getUniversalLinkDisplay = () => {
    if (!connectionUrl) return null;
    return connectionUrl.substring(0, 50) + '...';
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

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
            {isMobile ? (
              <div className="flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5" />
                Select Mobile Wallet
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Monitor className="w-5 h-5" />
                Select Desktop Wallet
              </div>
            )}
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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='8' y1='12' x2='16' y2='12'/%3E%3Cline x1='12' y1='8' x2='12' y2='16'/%3E%3C/svg%3E";
                  }}
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