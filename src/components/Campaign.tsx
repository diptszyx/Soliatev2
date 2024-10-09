import React, { useState } from 'react';
import { Card, CardMedia, IconButton, Menu, MenuItem, Box, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CampaignProps {
  campaign: {
    id: string;
    name: string;
    image: string;
    totalSolAmount: number;
  };
  showOptions?: boolean;
  onDelete?: (campaign: CampaignProps['campaign']) => void;
  onViewStats?: () => void;
}

const Campaign: React.FC<CampaignProps> = ({ campaign, showOptions, onDelete }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleClose(event);
    onDelete && onDelete(campaign);
  };

  const handleViewStats = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleClose(event);
    router.push(`/campaign-stats/${campaign.id}`);
  };

  return (
    <Link href={`/campaign/${campaign.id}`} passHref>
      <Card 
        className="relative cursor-pointer transition-transform hover:scale-105"
        sx={{ 
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        <CardMedia
          component="img"
          image={campaign.image}
          alt={campaign.name}
          sx={{ height: 300, objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            padding: '20px 16px',
          }}
        >
          <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold', marginBottom: 1 }}>
            {campaign.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Total: {campaign.totalSolAmount} SOL
          </Typography>
          {showOptions && (
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              <MoreHorizIcon />
            </IconButton>
          )}
        </Box>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon sx={{ marginRight: 1 }} /> Delete
          </MenuItem>
          <MenuItem onClick={handleViewStats}>
            <BarChartIcon sx={{ marginRight: 1 }} /> View Stats
          </MenuItem>
        </Menu>
      </Card>
    </Link>
  );
};

export default Campaign;