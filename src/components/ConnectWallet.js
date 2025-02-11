import React, { useState, useEffect } from 'react';
import { TonConnect } from '@tonconnect/sdk';
import { Loader2, Smartphone, Monitor, AlertCircle } from 'lucide-react';

// Fallback wallets in case remote fetch fails completely
const FALLBACK_WALLETS = [
  {
    name: "Tonkeeper",
    appName: "Tonkeeper",
    imageUrl: "https://tonkeeper.com/assets/tonkeeper-logo.png",
    universalUrl: "https://app.tonkeeper.com/ton-connect",
    bridgeUrl: "https://bridge.tonapi.io/bridge",
    injected: false
  },
  {
    name: "MyTonWallet",
    appName: "MyTonWallet",
    imageUrl: "https://mytonwallet.io/icon-256.png",
    universalUrl: "https://mytonwallet.org",
    bridgeUrl: "https://bridge.tonapi.io/bridge",
    injected: false
  }
];

const tonConnect = new TonConnect({
  manifestUrl: 'https://api.hashtagdigital.net/tonconnect-manifest.json',
});

// Configuration for wallet fetching
const WALLET_FETCH_CONFIG = {
  maxRetries: 3,
  initialTimeout: 15000, // 15 seconds initial timeout
  maxTimeout: 30000,     // 30 seconds maximum timeout
  retryDelay: 5000      // 5 seconds between retries
};

const ConnectWallet = ({ onConnect }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connectionUrl, setConnectionUrl] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    };
    setIsMobile(checkMobile());
  }, []);

  const fetchWalletsWithRetry = async (retryCount = 0) => {
    const timeout = Math.min(
      WALLET_FETCH_CONFIG.initialTimeout * Math.pow(1.5, retryCount),
      WALLET_FETCH_CONFIG.maxTimeout
    );

    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      );

      // Update progress based on current retry attempt
      const progressBase = (retryCount / WALLET_FETCH_CONFIG.maxRetries) * 100;
      setFetchProgress(progressBase);

      const walletPromise = tonConnect.getWallets();
      const result = await Promise.race([walletPromise, timeoutPromise]);

      // If we get here, we successfully got the wallets
      setFetchProgress(100);
      return result;
    } catch (error) {
      console.warn(`Attempt ${retryCount + 1} failed:`, error);
      
      if (retryCount < WALLET_FETCH_CONFIG.maxRetries - 1) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, WALLET_FETCH_CONFIG.retryDelay));
        return fetchWalletsWithRetry(retryCount + 1);
      }
      
      throw error;
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      setFetchProgress(0);
      
      let availableWallets;
      try {
        availableWallets = await fetchWalletsWithRetry();
        console.log('Successfully fetched wallets:', availableWallets);
      } catch (error) {
        console.warn('Failed to fetch wallets list after all retries, using fallback:', error);
        availableWallets = FALLBACK_WALLETS;
      }

      // Merge with fallback wallets to ensure we have the essential ones
      const combinedWallets = [...availableWallets];
      FALLBACK_WALLETS.forEach(fallbackWallet => {
        if (!combinedWallets.some(w => w.name === fallbackWallet.name)) {
          combinedWallets.push(fallbackWallet);
        }
      });

      // Filter out wallets with invalid configurations
      const validWallets = combinedWallets.filter(wallet => 
        wallet.universalUrl && wallet.bridgeUrl
      );

      if (validWallets.length === 0) {
        throw new Error('No valid wallets available');
      }

      setWallets(validWallets);
      
      tonConnect.onStatusChange((wallet) => {
        if (wallet) {
          console.log('Connected wallet:', wallet);
          onConnect(wallet);
        }
      }, error => {
        console.error('Connection status error:', error);
        setError('Lost connection to wallet. Please try reconnecting.');
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to initialize wallet connection. Please try again.');
    } finally {
      setLoading(false);
      setFetchProgress(0);
    }
  };

  const handleWalletSelect = async (wallet) => {
    try {
      setSelectedWallet(wallet);
      setError(null);
      
      const createConnection = async (retries = 3, delay = 1000) => {
        try {
          const universalLink = tonConnect.connect({
            universalUrl: wallet.universalUrl,
            bridgeUrl: wallet.bridgeUrl,
            timeout: 15000 // 15 second timeout for connection attempts
          });
          return universalLink;
        } catch (error) {
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, delay));
          return createConnection(retries - 1, delay * 2);
        }
      };

      const universalLink = await createConnection();
      setConnectionUrl(universalLink);

      if (isMobile) {
        window.location.href = universalLink;
      } else if (wallet.injected) {
        try {
          await wallet.connect();
        } catch (error) {
          if (error.message?.includes('not installed')) {
            setError('Wallet extension not detected. Please install it first.');
          } else {
            setError('Failed to connect to wallet extension. Please try again.');
          }
          setSelectedWallet(null);
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError('Failed to connect to wallet. Please try a different wallet or try again later.');
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
        <div className="space-y-4">
          <button 
            onClick={connectWallet}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading Wallets {fetchProgress > 0 ? `(${Math.round(fetchProgress)}%)` : ''}
              </>
            ) : (
              'Connect Wallet'
            )}
          </button>
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${fetchProgress}%` }}
              />
            </div>
          )}
        </div>
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