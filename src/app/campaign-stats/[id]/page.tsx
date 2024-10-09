'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Paper, Grid, CircularProgress, List, ListItem, ListItemText, Button } from '@mui/material';
import { saveAs } from 'file-saver';

interface CampaignStats {
  id: string;
  balance: string;
  totalInteractions: number;
  totalSharers: number;
  interactors: string[];
  sharers: string[];
}

interface SharerCount {
  address: string;
  count: number;
}

function createCSV(data: string[]): string {
  return data.join('\n');
}

function countSharers(sharers: string[]): SharerCount[] {
  const counts = sharers.reduce((acc, sharer) => {
    acc[sharer] = (acc[sharer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts).map(([address, count]) => ({ address, count }));
}

export default function CampaignStats() {
  const params = useParams();
  const id = params?.id as string;
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharerCounts, setSharerCounts] = useState<SharerCount[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/campaign-stats/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign stats');
        }
        const data = await response.json();
        setStats(data);
        setSharerCounts(countSharers(data.sharers));
      } catch (error) {
        console.error('Error fetching campaign stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [id]);

  const handleDownloadCSV = (type: 'interactors' | 'sharers') => {
    if (!stats) return;

    const data = type === 'interactors' ? stats.interactors : stats.sharers;
    const csvContent = createCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${type}.csv`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!stats) {
    return <Typography>Không tìm thấy dữ liệu thống kê cho chiến dịch này.</Typography>;
  }

  const balanceInSOL = parseFloat(stats.balance) / 1e9; // Chuyển đổi từ lamports sang SOL

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className="p-4">
          <Typography variant="h6">Thông tin chung</Typography>
          <Typography>Số dư: {balanceInSOL} SOL</Typography>
          <Typography>Tổng số tương tác: {stats.totalInteractions}</Typography>
          <Typography>Tổng số người chia sẻ: {stats.totalSharers}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper className="p-4">
          <Typography variant="h6">Danh sách địa chỉ ví người tương tác</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleDownloadCSV('interactors')} 
            style={{ marginBottom: '1rem' }}
          >
            Tải xuống CSV Interactors
          </Button>
          <List>
            {stats.interactors.map((interactor, index) => (
              <ListItem key={index}>
                <ListItemText primary={interactor} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper className="p-4">
          <Typography variant="h6">Danh sách địa chỉ ví người chia sẻ</Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => handleDownloadCSV('sharers')} 
            style={{ marginBottom: '1rem' }}
          >
            Tải xuống CSV Sharers
          </Button>
          <List>
            {sharerCounts.map((sharer, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={sharer.address} 
                  secondary={`Số lần chia sẻ: ${sharer.count}`} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}
