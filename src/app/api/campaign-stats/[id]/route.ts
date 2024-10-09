import { NextRequest, NextResponse } from 'next/server';
import {  PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, BN } from "@coral-xyz/anchor";
import idl from '../../../../idl.json';
import { getConnection} from '@/lib/solanaConnection';




export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const connection = getConnection();
  const campaignId = params.id;

  try {
    const provider = new AnchorProvider(connection, {} as any, {});
    const program = new Program(idl as Idl, provider);

    const assetId = new PublicKey(campaignId);

    const [assetVaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("asset_vault"), assetId.toBuffer()],
      program.programId
    );

    const accountInfo = await connection.getAccountInfo(assetVaultPDA);

    if (!accountInfo) {
      throw new Error("Asset vault account not found");
    }

    const vaultInfo = program.coder.accounts.decode('assetVault', accountInfo.data);

    const balance = vaultInfo.balance as BN;
    const interactors = (vaultInfo.interacted as PublicKey[]).map(pubkey => pubkey.toString());
    const sharers = (vaultInfo.sharers as PublicKey[]).map(pubkey => pubkey.toString());

    const response = {
      id: campaignId,
      balance: balance.toString(),
      totalInteractions: interactors.length,
      totalSharers: sharers.length,
      interactors,
      sharers,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching campaign stats:", error);
    return NextResponse.json({ error: "Failed to fetch campaign stats" }, { status: 500 });
  }
}