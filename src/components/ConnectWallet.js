import React, { useEffect, useState } from 'react';
import { TonConnect } from '@tonconnect/sdk';

const tonConnect = new TonConnect({
  manifestUrl: 'https://api.hashtagdigital.net/tonconnect-manifest.json', // Update with your hosted manifest
});

console.log('tonConnect:', tonConnect);

const ConnectWallet = ({ onConnect }) => {

  return (
    <div>
        <button >Connect Wallet</button>
    </div>
  );
};

export default ConnectWallet;
