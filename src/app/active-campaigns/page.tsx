"use client";

import React, { useState, useEffect } from 'react';
import Campaign from '@/components/Campaign';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Typography, Pagination } from '@mui/material';

interface CNFT {
  id: string;
  name: string;
  uri: string;
  image: string;
  totalSolAmount: number;
}

export default function ListCPPage() {
  const [cNFTs, setCNFTs] = useState<CNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(4);
  
  useEffect(() => {
    const fetchCNFTs = async () => {
      if (!publicKey) {
        console.log("Wallet not available");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching CNFTs started");

        const response = await fetch('/api/list-campaigns');
        if (!response.ok) {
          throw new Error('Failed to fetch CNFTs');
        }
        const cNFTData = await response.json();
        if (cNFTData.message === "No campaigns available") {
          setCNFTs([]);
        } else {
          setCNFTs(cNFTData);
        }

        setLoading(false);
        console.log("Fetching CNFTs completed");
      } catch (error) {
        console.error("Error fetching cNFTs:", error);
        toast.error("Failed to fetch cNFTs", { autoClose: 1000 });
        setLoading(false);
      }
    };

    fetchCNFTs();
  }, [publicKey]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Calculate the current page's CNFTs
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCNFTs = cNFTs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-8">
      <Typography variant="h4" component="h1" className="text-6xl font-bold leading-tight italic  tracking-wide transform -skew-x-6 mb-8">
        List Campaigns
      </Typography>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : cNFTs.length === 0 ? (
        <p className="text-center text-gray-600">No campaigns available</p>
      ) : (
        <>
          <Grid container spacing={4}>
            {currentCNFTs.map((cNFT) => (
              <Grid item key={cNFT.id} xs={12} sm={6} md={4} lg={3}>
                <Campaign campaign={cNFT} />
              </Grid>
            ))}
          </Grid>
          <div className="flex justify-center mt-8">
            <Pagination
              count={Math.ceil(cNFTs.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#89F717',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: '#89F717',
                  color: '#000',
                },
              }}
            />
          </div>
          <div className="flex justify-center mt-4 text-gray-600">
            {`${page} / ${Math.ceil(cNFTs.length / itemsPerPage)}`}
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}