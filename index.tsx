import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

// Configurazione della rete (Devnet di default)
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork || WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App endpoint={endpoint} />
  </React.StrictMode>
);