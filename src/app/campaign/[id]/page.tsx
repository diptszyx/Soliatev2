"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCopy } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program, AnchorProvider, Idl, BN } from "@coral-xyz/anchor";
import idl from '../../../idl.json';

interface Campaign {
  name: string;
  image: string;
  description: string;
  totalSolAmount: number;
  numberOfParticipants: number;
  percentageForSharer: number;
  solForSharer: number;
  vaultBalance: number;
  vaultInteractions: number;
}

export default function CampaignDetails() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const params = useParams();
  const assetId = params?.id as string ?? '';
  const [isGenerating, setIsGenerating] = useState(false);
  const [blinkUrl, setBlinkUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!wallet || !connection) {
        console.log("Wallet or connection not available");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching campaign started");

        const response = await fetch(`/api/campaign/${assetId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign data');
        }
        const campaignData = await response.json();
        setCampaign(campaignData);

        setLoading(false);
        console.log("Fetching campaign completed");
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch campaign information", { autoClose: 1000 });
        setLoading(false);
      }
    };

    fetchData();
  }, [connection, wallet, assetId]);

  const generateBlink = async () => {
    if (!wallet || !connection || !campaign) return;

    setIsGenerating(true);

    try {
      const provider = new AnchorProvider(connection, wallet, {});
      const program = new Program(idl as Idl,  provider);

      const sharerAddress = wallet.publicKey;

      const [actionPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("action"), new PublicKey(assetId).toBuffer(), sharerAddress.toBuffer()],
        program.programId
      );

      // Check if PDA already exists
      const actionAccount = await connection.getAccountInfo(actionPDA);

      if (actionAccount) {
        // PDA đã tồn tại, tạo và hiển thị Blink URL
        console.log("Action PDA already exists:", actionPDA.toBase58());
        const blinkUrl = `https://dial.to/?action=solana-action:https://api.soliate.xyz/api/action/${actionPDA.toBase58()}`;
        setBlinkUrl(blinkUrl);
        toast.success("Blink URL retrieved successfully", { autoClose: 1000 });
      } else {
        // PDA chưa tồn tại, tạo mới
        const solForInteractor = campaign.totalSolAmount / campaign.numberOfParticipants - campaign.solForSharer;

        await program.methods
          .createActionPda( 
            new PublicKey(assetId),
            new PublicKey(wallet.publicKey.toBase58()),
            new BN(campaign.solForSharer * LAMPORTS_PER_SOL),
            new BN(solForInteractor * LAMPORTS_PER_SOL)
          )
          .accounts({
            assetId: new PublicKey(assetId),
            actionPda: actionPDA, 
            user: wallet.publicKey,
            mintAddress: new PublicKey(assetId),
            sharerAddress: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        // Sau khi tạo xong, tạo và hiển thị Blink URL
        console.log("Action PDA created successfully:", actionPDA.toBase58());
        const blinkUrl = `https://dial.to/?action=solana-action:https://api.soliate.xyz/api/action/${actionPDA.toBase58()}`;
        setBlinkUrl(blinkUrl);
        toast.success("Blink URL created successfully", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error generating Blink:", error);
      toast.error("Failed to generate Blink URL", { autoClose: 1000 });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Blink URL copied to clipboard!", { autoClose: 1000 });
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error("Failed to copy Blink URL");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold italic text-gray-900 mb-8 ">
          Campaign 
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : !campaign ? (
          <p className="text-center text-xl text-gray-700">Campaign not found</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="relative aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={campaign.image}
                  alt={campaign.name}
                  width={600}
                  height={600}
                  className="transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{campaign.name}</h2>
              <p className="text-lg text-gray-700 mb-6">{campaign.description}</p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Total SOL", value: `${campaign.totalSolAmount} SOL` },
                  { label: "Participants", value: campaign.numberOfParticipants },
                  { label: "Sharer %", value: `${campaign.percentageForSharer}%` },
                  { label: "Sharer SOL", value: `${campaign.solForSharer} SOL` },
                  { label: "Current Balance", value: `${campaign.vaultBalance} SOL` },
                  { label: "Interactions", value: campaign.vaultInteractions }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{item.label}</h3>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={generateBlink}
                disabled={isGenerating}
                className="w-full bg-[#89F717] text-black font-bold py-4 px-6 rounded-full hover:bg-[#7AE008] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                {isGenerating ? 'Generating...' : 'Generate Blink URL'}
              </button>
              
              {blinkUrl && (
                <div className="mt-4 p-4 bg-gray-100 rounded-xl flex items-center justify-between overflow-hidden transition-all duration-300 hover:bg-gray-200">
                  <p className="text-sm text-gray-800 truncate flex-grow mr-4">{blinkUrl}</p>
                  <button 
                    onClick={() => copyToClipboard(blinkUrl)}
                    className="flex-shrink-0 text-gray-600 hover:text-gray-900 transition-colors duration-300"
                  >
                    <FaCopy size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}