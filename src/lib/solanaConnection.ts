import { Connection } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { AnchorWallet } from '@solana/wallet-adapter-react';

let connection: Connection | null = null;
let umi: ReturnType<typeof createUmi> | null = null;

const getRpcUrl = () => `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

export function getConnection() {
  if (!connection) {
    connection = new Connection(getRpcUrl());
  }
  return connection;
}

export function getUmi(wallet: AnchorWallet | null) {
  if (!umi || (wallet && !umi.identity)) {
    umi = createUmi(getRpcUrl())
      .use(dasApi())
      .use(mplBubblegum());
    
    if (wallet) {
      umi = umi.use(walletAdapterIdentity(wallet));
    }
  }
  return umi;
}