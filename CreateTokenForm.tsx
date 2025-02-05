import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { createMint, getMinimumBalanceForRentExemptMint, createAssociatedTokenAccount, mintTo } from '@solana/spl-token';

export const CreateTokenForm = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [tokenDetails, setTokenDetails] = useState({
    name: '',
    symbol: '',
    decimals: 9,
    supply: 1000,
  });
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      setStatus('Collega il wallet prima!');
      return;
    }

    try {
      setStatus('Creazione del token...');
      
      // Genera il Mint Account
      const mintKeypair = Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      // Transazione per creare il Mint
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: 82,
          lamports,
          programId: SystemProgram.programId,
        }),
        createMint(
          publicKey,
          mintKeypair.publicKey,
          publicKey,
          publicKey,
          tokenDetails.decimals
        )
      );

      // Invia la transazione
      const signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });
      await connection.confirmTransaction(signature);

      // Crea l'Associated Token Account
      const associatedTokenAccount = await createAssociatedTokenAccount(
        connection,
        publicKey,
        mintKeypair.publicKey,
        publicKey
      );

      // Mint dei token
      await mintTo(
        connection,
        publicKey,
        mintKeypair.publicKey,
        associatedTokenAccount,
        publicKey,
        tokenDetails.supply * Math.pow(10, tokenDetails.decimals)
      );

      setStatus(`✅ Token creato! Mint Address: ${mintKeypair.publicKey}`);
    } catch (error) {
      setStatus(`❌ Errore: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="token-form">
      <div className="form-group">
        <label>Nome del Token</label>
        <input
          type="text"
          value={tokenDetails.name}
          onChange={(e) => setTokenDetails({ ...tokenDetails, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Simbolo</label>
        <input
          type="text"
          value={tokenDetails.symbol}
          onChange={(e) => setTokenDetails({ ...tokenDetails, symbol: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Decimali</label>
        <input
          type="number"
          value={tokenDetails.decimals}
          onChange={(e) => setTokenDetails({ ...tokenDetails, decimals: parseInt(e.target.value) || 0 })}
          min="0"
          max="18"
        />
      </div>
      <div className="form-group">
        <label>Supply</label>
        <input
          type="number"
          value={tokenDetails.supply}
          onChange={(e) => setTokenDetails({ ...tokenDetails, supply: parseInt(e.target.value) || 0 })}
          min="1"
        />
      </div>
      <button type="submit" className="submit-button">Crea Token</button>
      {status && <div className="status-message">{status}</div>}
    </form>
  );
};