'use client';

import React, { useState, useEffect } from 'react';
import { generateSigner, none } from '@metaplex-foundation/umi'
import { createTree, mintV1, parseLeafFromMintV1Transaction, LeafSchema } from '@metaplex-foundation/mpl-bubblegum';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast, ToastContainer } from 'react-toastify';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Program, AnchorProvider, Idl, setProvider, BN } from "@coral-xyz/anchor";
import idl from '../../idl.json';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUmi } from '@/lib/solanaConnection';


export default function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    campaignName: '',
    description: '',
    totalSolAmount: '0.1',
    numberOfParticipants: '1',
    percentageForSharer: '1',
  });
  const [file, setFile] = useState<File | null>(null);
  const [calculatedAmounts, setCalculatedAmounts] = useState({
    eachParticipant: 0,
    sharer: 0,
    viewer: 0,
  });
  const [program, setProgram] = useState<Program | null>(null);
  const [umi, setUmi] = useState<any>(null); 
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/ad-dashboard');
  }, [router]);

  useEffect(() => {
  if (wallet && connection) {
    const provider = new AnchorProvider(connection, wallet, {});
    setProvider(provider);
    const program = new Program(idl as Idl, provider);
    setProgram(program);

    const umi = getUmi(wallet);
    setUmi(umi);
  
  }
}, [connection, wallet]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const totalSol = parseFloat(formData.totalSolAmount) || 0;
    const participants = parseInt(formData.numberOfParticipants) || 1;
    const sharerPercentage = parseFloat(formData.percentageForSharer) || 0;

    const eachParticipant = totalSol / participants;
    const sharerAmount = eachParticipant * (sharerPercentage / 100);
    const viewerAmount = eachParticipant - sharerAmount;

    setCalculatedAmounts({
      eachParticipant: Number(eachParticipant.toFixed(9)),
      sharer: Number(sharerAmount.toFixed(9)),
      viewer: Number(viewerAmount.toFixed(9)),
    });
  }, [formData.totalSolAmount, formData.numberOfParticipants, formData.percentageForSharer]);

  async function createAndStoreTreeAddress() {
    if (!program || !umi) {
      throw new Error("Program or Umi not initialized");
    }

    if (!publicKey) {
      throw new Error("Wallet public key not found");
    }

    const [treePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("tree")],
      program.programId
    );

    try {
      const treeAccount = await connection.getAccountInfo(treePDA);
      if (treeAccount) {
        console.log("Tree PDA already exists:", treePDA.toString());
        console.log("Raw account data:", treeAccount.data);
        try {
          const treeData = program.coder.accounts.decode('treeData', treeAccount.data);
          const existingTreeAddress = treeData.treeAddress;
          console.log("Using existing tree address:", existingTreeAddress.toString());
          return { treeAddress: existingTreeAddress, treePDA };
        } catch (decodeError) {
          console.error("Error decoding treeData:", decodeError);
        }
      }
    } catch (error) {
      console.error("Error checking tree PDA:", error);
    }

    const merkleTree = generateSigner(umi);
    const builder = await createTree(umi, {
      merkleTree,
      maxDepth: 14,
      maxBufferSize: 64,
      public: true,
    });
    try {
      await builder.sendAndConfirm(umi);
    } catch (error: any) {
      if (error.logs) {
        console.error("Transaction logs:", error.logs);
      }
      throw error;
    }

    const treeAddress = new PublicKey(merkleTree.publicKey.toString());

    try {
      await program.methods.createTreePda(treeAddress)
        .accounts({
          treePda: treePDA,
          user: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    } catch (error: any) {
      console.error("Error creating TreePDA:", error);
      throw error;
    }

    return { treeAddress, treePDA };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    if (!program || !umi) {
      toast.error("Program or Umi not initialized", { autoClose: 1000 });
      setIsCreating(false);
      return;
    }

    // Add validation
    if (parseFloat(formData.totalSolAmount) < 0.1) {
      toast.error("Total SOL amount must be at least 0.1", { autoClose: 1000 });
      setIsCreating(false);
      return;
    }

    if (parseInt(formData.numberOfParticipants) < 1) {
      toast.error("Number of participants must be at least 1", { autoClose: 1000 });
      setIsCreating(false);
      return;
    }

    if (parseFloat(formData.percentageForSharer) < 1) {
      toast.error("Percentage for sharer must be at least 1%", { autoClose: 1000 });
      setIsCreating(false);
      return;
    }

    try {
      const { treeAddress, treePDA } = await createAndStoreTreeAddress();
      console.log('Tree address:', treeAddress.toString());
      console.log('Tree PDA:', treePDA.toString());

      // Upload file and create metadata using the API
      const apiFormData = new FormData();
      if (file) {
        apiFormData.append('file', file);
      }
      apiFormData.append('campaignData', JSON.stringify(formData));

      const response = await fetch('/api/create-campaign', {
        method: 'POST',
        body: apiFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign metadata');
      }

      const { imageUri, metadataUri } = await response.json();

      // Mint NFT
      const { signature } = await mintV1(umi, {
        leafOwner: treeAddress,
        merkleTree: treeAddress,
        leafDelegate : umi.identity.publicKey,
        metadata: {
          name: formData.campaignName,
          uri: metadataUri,
          sellerFeeBasisPoints: 500,
          creators: [{ address: umi.identity.publicKey, verified: false, share: 100 }],
          collection: none(),
        },
      }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } });

      const leaf: LeafSchema = await parseLeafFromMintV1Transaction(umi, signature);
      const assetId = leaf.id;

      console.log('Asset ID:', assetId.toString());

      // Initialize the asset vault
      const initialBalance = new BN(parseFloat(formData.totalSolAmount) * LAMPORTS_PER_SOL);
      
      const [assetVaultPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("asset_vault"), new PublicKey(assetId.toString()).toBuffer()],
        program.programId
      );

      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      await program.methods.initializeAssetVault(initialBalance)
        .accounts({
          owner: publicKey,
          assetVault: assetVaultPDA,
          assetId: new PublicKey(assetId.toString()),
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Asset vault initialized');

      toast.success("Campaign created successfully!", {
        position: "top-center",
        autoClose: 1000,
      });

      router.replace('/ad-dashboard');
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      let errorMessage = "Failed to create campaign";
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      if (error.logs) {
        console.error("Transaction logs:", error.logs);
      }
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };

 return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold italic mb-6 text-gray-800 animate-fade-in ">Create Campaign</h1>
        <p className="text-[#99CF63] mb-8 text-xl animate-fade-in-delay">
          Looking for a template? <a href="#" className="underline hover:text-[#7AE008] transition-colors">Take a trip here!</a>
        </p>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <form onSubmit={handleSubmit} className="w-full lg:w-2/3 space-y-8 animate-slide-in">
            <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="campaignName" className="block text-sm font-medium mb-2 text-gray-700">Campaign name</label>
                  <input
                    type="text"
                    id="campaignName"
                    name="campaignName"
                    value={formData.campaignName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99CF63] transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="totalSolAmount" className="block text-sm font-medium mb-2 text-gray-700">Total SOL amount</label>
                  <input
                    type="number"
                    id="totalSolAmount"
                    name="totalSolAmount"
                    value={formData.totalSolAmount}
                    onChange={handleInputChange}
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99CF63] transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99CF63] transition-all"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="numberOfParticipants" className="block text-sm font-medium mb-2 text-gray-700">Number of participants</label>
                  <input
                    type="number"
                    id="numberOfParticipants"
                    name="numberOfParticipants"
                    value={formData.numberOfParticipants}
                    onChange={handleInputChange}
                    min="1"
                    step="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99CF63] transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="percentageForSharer" className="block text-sm font-medium mb-2 text-gray-700">% for sharers</label>
                  <input
                    type="number"
                    id="percentageForSharer"
                    name="percentageForSharer"
                    value={formData.percentageForSharer}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    step="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99CF63] transition-all"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-[#99CF63]">Calculated Amounts</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Sharer Amount</p>
                  <p className="text-2xl font-bold text-gray-800">{calculatedAmounts.sharer} SOL</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Viewer Amount</p>
                  <p className="text-2xl font-bold text-gray-800">{calculatedAmounts.viewer} SOL</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Per Participant</p>
                  <p className="text-2xl font-bold text-gray-800">{calculatedAmounts.eachParticipant} SOL</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
              <div>
                <label htmlFor="file" className="block text-sm font-medium mb-2 text-gray-700">Upload Image</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#99CF63] transition-all"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailConsent"
                  className="w-5 h-5 text-[#99CF63] border-gray-300 rounded focus:ring-[#99CF63]"
                />
                <label htmlFor="emailConsent" className="ml-3 text-sm text-gray-700">
                  I want to receive emails about product updates, events, and promotions.
                </label>
              </div>
              
              <p className="text-sm text-gray-600">
                By creating a campaign, you agree to the <a href="#" className="text-[#99CF63] hover:underline">Terms of use</a> and <a href="#" className="text-[#99CF63] hover:underline">Privacy Policy</a>.
              </p>
              
              <button
                type="submit"
                className={`w-full font-bold py-4 px-6 rounded-lg transition duration-300 ${
                  isCreating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#99CF63] hover:bg-[#7AE008] text-white transform hover:scale-105'
                }`}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </form>
          
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0 animate-slide-in-delay">
            <div className="sticky top-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Preview</h3>
                <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {file ? (
                    <Image 
                      src={URL.createObjectURL(file)} 
                      alt="Selected" 
                      width={300} 
                      height={300} 
                      className="rounded-lg object-cover w-full h-full" 
                    />
                  ) : (
                    <p className="text-gray-400">No image selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}