import { NextRequest, NextResponse } from 'next/server';
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { publicKey } from '@metaplex-foundation/umi';
import idl from '../../../../idl.json';
import { getConnection, getUmi } from '@/lib/solanaConnection';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const connection = getConnection();
  const provider = new AnchorProvider(connection, {} as any, {});
  const program = new Program(idl as Idl, provider);
  const assetId = params.id;

  try {
    const umi = getUmi(null);

    const assetPublicKey = publicKey(assetId);
    const rpcAsset = await umi.rpc.getAsset(assetPublicKey);

    if (rpcAsset) {
      const metadata = await fetch(rpcAsset.content.json_uri).then(res => res.json());
      const campaignData = {
        name: rpcAsset.content.metadata.name || '',
        image: metadata.image || '',
        description: metadata.description || '',
        totalSolAmount: parseFloat(metadata.attributes.find((attr: any) => attr.trait_type === "Total SOL Amount")?.value || '0'),
        numberOfParticipants: parseInt(metadata.attributes.find((attr: any) => attr.trait_type === "Number of Participants")?.value || '0', 10),
        percentageForSharer: parseFloat(metadata.attributes.find((attr: any) => attr.trait_type === "Percentage for Sharer")?.value || '0'),
        solForSharer: 0,
        vaultBalance: 0,
        vaultInteractions: 0,
      };
      campaignData.solForSharer = (campaignData.totalSolAmount / campaignData.numberOfParticipants) * (campaignData.percentageForSharer / 100);

      const [vaultAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from("asset_vault"), new PublicKey(assetId).toBuffer()],
        program!.programId
      );

      const vaultAccount = await connection!.getAccountInfo(vaultAddress);
      if (vaultAccount) {
        const vaultInfo = program!.coder.accounts.decode('assetVault', vaultAccount.data);
        campaignData.vaultBalance = vaultInfo.balance ? vaultInfo.balance.toNumber() / LAMPORTS_PER_SOL : 0;
        campaignData.vaultInteractions = vaultInfo.interacted ? vaultInfo.interacted.length : 0;
        
        console.log("Vault info:", vaultInfo); // For debugging
        console.log("Campaign data:", campaignData); // For debugging
      }

      return NextResponse.json(campaignData);
    } else {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return NextResponse.json({ error: "Failed to fetch campaign data" }, { status: 500 });
  }
}
