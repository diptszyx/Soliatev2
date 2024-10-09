'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Typography, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Campaign from '@/components/Campaign';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet, useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAssetWithProof, burn } from '@metaplex-foundation/mpl-bubblegum';
import { publicKey as umiPublicKey } from '@metaplex-foundation/umi';
import { getUmi } from '@/lib/solanaConnection';



interface CNFT {
  id: string;
  name: string;
  uri: string;
  image: string;
  totalSolAmount: number;
}

export default function AdDashboard() {
  const [cNFTs, setCNFTs] = useState<CNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [umi, setUmi] = useState<any>(null); 

  useEffect(() => {
    const initializeAndFetch = async () => {
      if (!publicKey || !wallet || !connection) {
        return;
      }

      try {
        setLoading(true);

        const umi = getUmi(wallet);
        setUmi(umi);

        // Fetch CNFTs
        const response = await fetch(`/api/dashboard-campaigns?creator=${publicKey.toString()}`);
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
      } catch (error) {
        console.error("Error during initialization or fetching:", error);
        toast.error("Failed to initialize or fetch data", { autoClose: 1000 });
        setLoading(false);
      }
    };

    initializeAndFetch();
  }, [publicKey, wallet, connection]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDeleteClick = (campaign: CNFT) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete || !publicKey || !umi) return;

    try {
      setLoading(true);
      console.log("Starting campaign deletion process");

      const assetId = umiPublicKey(campaignToDelete.id);
      
      console.log("Fetching asset with proof");
      let assetWithProof;
      try {
        assetWithProof = await getAssetWithProof(umi, assetId);
        console.log("Asset with proof:", assetWithProof);
      } catch (error) {
        console.error("Error fetching asset with proof:", error);
        if (error instanceof Error && error.message.includes("Asset not found")) {
          toast.warn("Chiến dịch không tồn tại hoặc đã bị xóa trước đó", {autoClose: 3000});
          // Cập nhật state để loại bỏ chiến dịch không tồn tại
          setCNFTs(prevCNFTs => prevCNFTs.filter(cnft => cnft.id !== campaignToDelete.id));
          setLoading(false);
          setDeleteDialogOpen(false);
          setCampaignToDelete(null);
          return;
        }
        throw error; // Ném lỗi nếu đó không phải là lỗi "Asset not found"
      }

      console.log("Burning asset");
      const burnResult = await burn(umi, {
        ...assetWithProof,
        leafOwner: umiPublicKey(publicKey),
      }).sendAndConfirm(umi); 

      console.log("Burn transaction result:", burnResult);

      if (burnResult.result.value.err) {
        throw new Error('Failed to burn asset');
      }

      toast.success("Chiến dịch đã được xóa thành công");
      setCNFTs(cNFTs.filter(cnft => cnft.id !== campaignToDelete.id));
    } catch (error) {
      console.error("Error deleting campaign:", error);
      if (error instanceof Error) {
        toast.error(`Không thể xóa chiến dịch: ${error.message}`, {autoClose: 3000});
      } else {
        toast.error("Đã xảy ra lỗi không xác định khi xóa chiến dịch", {autoClose: 3000});
      }
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCampaignToDelete(null);
  };

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCNFTs = cNFTs.slice(indexOfFirstItem, indexOfLastItem);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<CNFT | null>(null);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h4" component="h1" className="text-6xl font-bold leading-tight italic tracking-wide transform -skew-x-6">
          Campaign Dashboard
        </Typography>
        <Link href="/create-cp" passHref>
          <button className="bg-[#BCBCBC] hover:bg-[#A0A0A0] text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
            <AddIcon className="mr-2" />
            Create Campaign
          </button>
        </Link>
      </div>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : cNFTs.length === 0 ? (
        <p className="text-center text-gray-600">No campaigns available</p>
      ) : (
        <>
          <Grid container spacing={4}>
            {currentCNFTs.map((cNFT) => (
              <Grid item key={cNFT.id} xs={12} sm={6} md={4} lg={3}>
                <Campaign 
                  campaign={cNFT} 
                  showOptions={true}
                  onDelete={() => handleDeleteClick(cNFT)}
                />
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
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Xác nhận xóa chiến dịch"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bạn có chắc chắn muốn xóa chiến dịch này không? Toàn bộ số tiền còn lại của chiến dịch sẽ được hoàn lại cho bạn.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Hủy
              </Button>
              <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                Xác nhận
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <ToastContainer />
    </div>
  );
}