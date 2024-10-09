import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import idl from '../../../idl.json';
import NodeCache from 'node-cache';
import { getConnection } from '@/lib/solanaConnection';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { walletAddress } = await req.json();

  if (!walletAddress) {
    return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
  }

  const cacheKey = `advertiser_${walletAddress}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult !== undefined) {
    return NextResponse.json({ isAdvertiser: cachedResult });
  }

  try {
    const connection = getConnection();
    const provider = new AnchorProvider(connection, {} as any, {});
    const program = new Program(idl as Idl, provider);

    const [advertiserPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('advertiser'), new PublicKey(walletAddress).toBuffer()],
      program.programId
    );

    const accountInfo = await connection.getAccountInfo(advertiserPDA);
    const isAdvertiser = !!accountInfo;

    cache.set(cacheKey, isAdvertiser);

    return NextResponse.json({ isAdvertiser });
  } catch (error) {
    console.error('Error checking advertiser status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}