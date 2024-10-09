'use client';

import React, { useEffect, useState } from 'react';
import { useWallet, useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Program, AnchorProvider, Idl, web3 } from '@coral-xyz/anchor';
import Cookies from 'js-cookie';

import idl from '../../idl.json';

export default function PreAdPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState<Program | null>(null);
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (connection && publicKey && wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      const program = new Program(idl as Idl, provider);
      setProgram(program);
    }
  }, [connection, publicKey, wallet]);

  const handleSignUp = async () => {
    if (!publicKey) {
      toast.warning('Please connect your wallet first', {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    if (!program) {
      toast.error('Program not initialized', {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    const [advertiserPDA] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('advertiser'), publicKey.toBuffer()],
      program.programId
    );

    try {
      const tx = await program.methods
        .createAdvertiserPda()
        .accounts({
          advertiserPda: advertiserPDA,
          user: publicKey,
          advertiserAddress: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Advertiser account created. Transaction signature:", tx);

      // Cập nhật cookie sau khi đăng ký thành công
      Cookies.set(`advertiserStatus_${publicKey.toString()}`, 'true', { expires: 1 });

      toast.success('Advertiser account created successfully!', {
        position: "top-center",
        autoClose: 1000,
      });
      router.push('/ad-dashboard');
    } catch (error) {
      console.error('Error creating advertiser account:', error);
      toast.error('Failed to create advertiser account. Please try again.', {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div className="container mx-auto px-4 py-16 text-center">
        <Image
          src="/logo.png"
          alt="Soliate Logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-7xl font-bold mb-4">
          SOLIATE
        </h1>
        <h2 className="text-4xl font-bold mb-12 text-[#89F717]">
          Become a Web3 Advertiser
        </h2>
        
        <div className="grid grid-cols-3 gap-8 mb-12">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border border-[#89F717] rounded-lg h-48">
              {/* Placeholder for feature content */}
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleSignUp}
          className="bg-[#89F717] text-black font-bold py-4 px-16 rounded-full text-xl hover:bg-[#7AE008] transition duration-300"
        >
          Lets cook now!
        </button>
      </div>
    </div>
  );
}
