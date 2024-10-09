import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { publicKey } from '@metaplex-foundation/umi';
import idl from '../../../idl.json';
import { getConnection, getUmi } from '@/lib/solanaConnection';

async function fetchMetadata(uri: string) {
  const response = await fetch(uri);
  const metadata = await response.json();
  return metadata;
}

export async function GET(req: NextRequest) {
  const connection = getConnection();

  try {
    const provider = new AnchorProvider(connection, {} as any, {});
    const program = new Program(idl as Idl, provider);

    const [treePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("tree")],
      program.programId
    );

    const treeAccount = await connection.getAccountInfo(treePDA);
    if (!treeAccount) {
      return NextResponse.json({ message: "No campaigns available" });
    }

    const treeData = program.coder.accounts.decode('treeData', treeAccount.data);
    const treeAddress = treeData.treeAddress;

    const umi = getUmi(null);

    const rpcAssetList = await umi.rpc.getAssetsByOwner({
      owner: publicKey(treeAddress.toString()),
    });

    if (rpcAssetList.items && rpcAssetList.items.length > 0) {
      const cNFTPromises = rpcAssetList.items.map(async (asset: any) => {
        const metadata = await fetchMetadata(asset.content.json_uri);
        return {
          id: asset.id,
          name: asset.content.metadata.name,
          uri: asset.content.json_uri,
          image: metadata.image || '',
          description: metadata.description || '',
          totalSolAmount: parseFloat(metadata.attributes.find((attr: any) => attr.trait_type === "Total SOL Amount")?.value || '0'),
        };
      });

      const cNFTData = await Promise.all(cNFTPromises);
      return NextResponse.json(cNFTData);
    } else {
      return NextResponse.json({ message: "No campaigns available" });
    }
  } catch (error) {
    console.error("Error fetching cNFTs:", error);
    return NextResponse.json({ message: "No campaigns available" });
  }
}