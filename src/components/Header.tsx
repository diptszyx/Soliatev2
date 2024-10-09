'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import styles from './WalletButton.module.css';
import { useQuery } from '@tanstack/react-query';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

const Header: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false); // Thêm state để theo dõi trạng thái điều hướng
  const [advertiserStatus, setAdvertiserStatus] = useState<boolean | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['advertiserStatus', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return null;
      const response = await fetch('/api/check-advertiser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      });
      const data = await response.json();
      return data.isAdvertiser;
    },
    enabled: !!connected && !!publicKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (data) {
      setAdvertiserStatus(data);
    }
  }, [data]);

  useEffect(() => {
    if (pathname === '/') {
      router.prefetch('/pre-ad');
      router.prefetch('/ad-dashboard');
    }
  }, [pathname, router]);

  const handlePostAd = async () => { // Đổi handlePostAd thành async
    if (!connected || !publicKey) {
      toast.warning('Connect wallet first', {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    if (isLoading) {
      toast.info('Checking status...', {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    setIsNavigating(true); // Bắt đầu điều hướng
    await router.push(advertiserStatus ? '/ad-dashboard' : '/pre-ad'); // Chờ cho đến khi điều hướng hoàn tất
    setIsNavigating(false); // Kết thúc điều hướng
  };

  useEffect(() => {
    if (connected && publicKey) {
      Cookies.set('walletAddress', publicKey.toString(), { expires: 1 });
    } else {
      Cookies.remove('walletAddress');
    }
  }, [connected, publicKey]);

  const navItems = [
    { 
      name: 'Service', 
      items: [
        { name: 'Amman', description: 'Local Validator Toolkit', icon: '🖨️' },
        { name: 'Legacy', description: 'Products from our old docs', icon: '🕰️' },
        { name: 'Umi', description: 'Client wrapper', icon: '🔄' },
        { name: 'DAS API', description: 'Fetch Digital Asset Data', icon: '📊' },
        { name: 'Sugar', description: 'Create Candy Machines easily', icon: '🍬' },
      ]
    },
    { 
      name: 'Toolkit', 
      items: [
        { name: 'Bubblegum', description: 'Compressed NFTs', icon: '🫧' },
        { name: 'Inscription', description: 'NFT inscribed on Solana', icon: '✍️' },
        { name: 'Token Auth Rules', description: 'NFT permissions', icon: '🔐' },
        { name: 'Core', description: 'Next gen NFT standard', icon: '🔷' },
        { name: 'MPL-Hybrid', description: 'Hybrid Assets', icon: '🔀' },
        { name: 'Token Metadata', description: 'Digital ownership standard', icon: '📝' },
      ]
    },
    { name: 'Active Campaigns', href: '/active-campaigns' },
    { name: 'Resource', href: '/resource' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="p-4 bg-white text-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="cursor-pointer">
          <div style={{ position: 'relative', width: '100px', height: '50px' }}>
            <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} />
          </div>
        </a>
        <nav className="flex-1 flex justify-center space-x-6">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              {item.href ? (
                <a href={item.href} className="hover:text-gray-600">{item.name}</a>
              ) : (
                <button
                  className="hover:text-gray-600 focus:outline-none"
                  onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                >
                  {item.name}
                </button>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <div className={styles.walletButtonWrapper}>
              <WalletMultiButton />
          </div>
          {pathname === '/' && (
            <button 
              onClick={handlePostAd}  
              className={`px-6 py-2 bg-white text-black font-medium rounded-full border-2 border-black hover:bg-gray-100 transition duration-300 ${isLoading || isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || isNavigating}
            >
              {isLoading || isNavigating ? 'Loading...' : 'Get started'}
            </button>
          )}
        </div>
      </div>
      {activeDropdown && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[600px] rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-50">
          <div className="grid grid-cols-2 gap-4 p-4">
            {navItems.find(item => item.name === activeDropdown)?.items?.map((subItem) => (
              <a
                key={subItem.name}
                href="#"
                className="flex items-center p-3 rounded-md hover:bg-gray-100 transition duration-150 ease-in-out"
              >
                <span className="text-2xl mr-3">{subItem.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{subItem.name}</p>
                  <p className="text-xs text-gray-500">{subItem.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </header>
  );
};

export default Header;
