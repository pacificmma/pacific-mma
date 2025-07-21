// src/components/UserProfile/PreviousPurchases.tsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const PreviousPurchases = () => {
  // Örnek alınan ürünler
  const purchases = [
    { id: 1, productName: 'MMA Gloves', date: '2024-07-01', price: '$80' },
    { id: 2, productName: 'Training Gi', date: '2023-10-22', price: '$120' },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Previous Purchases</Typography>
      <List>
        {purchases.map(item => (
          <ListItem key={item.id} divider>
            <ListItemText
              primary={item.productName}
              secondary={`Purchased on: ${item.date} — Price: ${item.price}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PreviousPurchases;
