import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import idl from '../idl.json';

let connection: Connection | null = null;

const getRpcUrl = () => `https://api.devnet.solana.com`;

export async function checkAdvertiserStatus(walletAddress: string): Promise<boolean> {
  if (!connection) {
    connection = new Connection(getRpcUrl());
  }
  const provider = new AnchorProvider(connection, {} as any, {});
  const program = new Program(idl as Idl, provider);

  const [advertiserPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('advertiser'), new PublicKey(walletAddress).toBuffer()],
    program.programId
  );

  const accountInfo = await connection.getAccountInfo(advertiserPDA);
  return !!accountInfo;
}
