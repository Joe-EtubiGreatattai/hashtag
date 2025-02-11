import React, { useEffect, useState } from 'react';
import { TonConnect } from '@tonconnect/sdk';

const tonConnect = new TonConnect({
  manifestUrl: 'https://api.hashtagdigital.net/tonconnect-manifest.json', // Update with your hosted manifest
});

console.log('tonConnect:', tonConnect);

const ConnectWallet = ({ onConnect }) => {

  const connectWallet = () => {
    tonConnect.getWallets().then((wallets) => {
      console.log(wallets);
    });
  }

  return (
    <div>
        <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
};

export default ConnectWallet;
