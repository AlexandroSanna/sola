import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { CreateTokenForm } from './components/CreateTokenForm';
import './styles/App.css';

interface AppProps {
  endpoint: string;
}

const App = ({ endpoint }: AppProps) => {
  // Configura i wallet supportati (Phantom in questo caso)
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="app-container">
            <h1>Creazione SPL Token su Solana</h1>
            <CreateTokenForm />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;