import {
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
  ActionPostRequest,
} from "@solana/actions";
import {
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Program, AnchorProvider, Idl, BN } from "@coral-xyz/anchor";
import idl from "../../../../idl.json";
import { publicKey } from '@metaplex-foundation/umi';
import { NextRequest, NextResponse } from 'next/server';
import { getConnection, getUmi } from '@/lib/solanaConnection';



async function getCampaign(assetId: string) {
  const umi = getUmi(null);

  try {
    const assetPublicKey = publicKey(assetId);
    const rpcAsset = await umi.rpc.getAsset(assetPublicKey);
    return rpcAsset;
  } catch (error) {
    console.error("Error fetching Campaign details:", error);
    throw error;
  }
}

export async function GET(req: NextRequest, { params }: { params: { actionPDA: string } }) {
  const { actionPDA } = params;

  console.log("Received actionPDA:", actionPDA);

  if (!actionPDA) {
    return NextResponse.json({ error: "Missing actionPDA" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
  }

  try {
    const connection = getConnection();
    const provider = new AnchorProvider(connection, {} as any, {});
    const program = new Program(idl as Idl, provider);


    const accountInfo = await connection.getAccountInfo(new PublicKey(actionPDA));
    console.log("Account info fetched:", accountInfo);
    
    if (!accountInfo) {
      return NextResponse.json({ error: "Action PDA not found" }, { status: 404, headers: ACTIONS_CORS_HEADERS });
    }

    // Attempt to decode the account data
    let actionAccount;
    try {
      actionAccount = program.coder.accounts.decode('actionData', accountInfo.data);
      console.log("Decoded action account:", actionAccount);
    } catch (error) {
      const decodeError = error as Error;
      console.error("Error decoding account data:", decodeError);
      // Log the raw account data for debugging
      console.log("Raw account data:", accountInfo.data.toString('hex'));
      return NextResponse.json({ 
        error: "Failed to decode account data", 
        details: decodeError.message,
        rawData: accountInfo.data.toString('hex')
      }, { status: 500, headers: ACTIONS_CORS_HEADERS });
    }

    const {
      assetId,
      sharerAddress,
      amountForSharer,
      amountForInteractor,
    } = actionAccount;

    console.log("Decoded Info:", {
      assetId: assetId.toBase58(),
      sharerAddress: sharerAddress.toBase58(),
      amountForSharer: amountForSharer.toString(),
      amountForInteractor: amountForInteractor.toString(),
    });

    const asset = await getCampaign(assetId.toBase58());
    console.log("Campaign fetched:", asset);

    const metadata = await fetch(asset.content.json_uri).then(res => res.json());
    console.log("Metadata fetched:", metadata);

    const payload: ActionGetResponse = {
      icon: metadata.image || "",
      label: "Claim Rewards",
      description: metadata.description || "Claim your rewards",
      title: asset.content.metadata.name || "Claim Rewards",
    };

    console.log("Final payload:", payload);

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json({ error: "Failed to fetch data", details: (error as Error).message }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
}

export async function POST(req: NextRequest, { params }: { params: { actionPDA: string } }) {
  try {
    const { actionPDA } = params;
    const body: ActionPostRequest = await req.json();

    const userPubkey = body.account;

    if (!actionPDA) {
      return NextResponse.json({ error: "Missing PDA parameter" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const connection = getConnection();
    const provider = new AnchorProvider(connection, {} as any, {});
    const program = new Program(idl as Idl, provider);

    const accountInfo = await connection.getAccountInfo(new PublicKey(actionPDA));
    if (!accountInfo) {
      return NextResponse.json({ error: "Action PDA not found" }, { status: 404, headers: ACTIONS_CORS_HEADERS });
    }

    // Giải mã dữ liệu tài khoản
    const actionAccount = program.coder.accounts.decode("actionData", accountInfo.data);
    const { assetId, sharerAddress, amountForSharer, amountForInteractor } = actionAccount;
    console.log("Decoded Info:", {
      assetId: assetId.toBase58(),
      sharerAddress: sharerAddress.toBase58(),
      amountForSharer: amountForSharer.toString(),
      amountForInteractor: amountForInteractor.toString(),
    });

    // Kiểm tra xem user có phải là sharer không
    if (userPubkey === sharerAddress.toString()) {
      return NextResponse.json({
        error: "Invalid wallet address",
        message: "The sharer's wallet address is not eligible to claim the reward. Please use a different wallet.",
      }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const [assetVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("asset_vault"), assetId.toBuffer()],
      program.programId
    );

    const vaultAccountInfo = await connection.getAccountInfo(assetVaultPda);
    if (!vaultAccountInfo) {
      return NextResponse.json({ error: " Vault account does not exist" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const decodedVaultInfo = program.coder.accounts.decode("assetVault", vaultAccountInfo.data);
    // Specify the type for addr
    if (decodedVaultInfo.interacted.some((addr: PublicKey) => addr.equals(new PublicKey(userPubkey)))) {
      return NextResponse.json({
        error: "Already claimed",
        message: "You have already claimed the reward . Each wallet can only claim once.",
      }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    // If not claimed, proceed with creating the transaction
    const tx = new Transaction();
    const withdrawIx = await program.methods
      .withdrawFromVault(new BN(amountForSharer), new BN(amountForInteractor))
      .accounts({
        assetVault: assetVaultPda,
        assetId: assetId,
        sharer: sharerAddress,
        interactor: new PublicKey(userPubkey),
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    tx.add(withdrawIx);
    tx.feePayer = new PublicKey(userPubkey);

    const bh = (await connection.getLatestBlockhash({ commitment: "finalized" })).blockhash;
    tx.recentBlockhash = bh;

    const serialTX = tx.serialize({ requireAllSignatures: false, verifySignatures: false }).toString("base64");
    const response = {
      transaction: serialTX,
      message: "Congratulations, you have successfully claimed your reward!",
    };

    return NextResponse.json(response, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: ACTIONS_CORS_HEADERS,
  });
}