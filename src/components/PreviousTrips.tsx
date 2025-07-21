// src/components/UserProfile/PreviousTrips.tsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const PreviousTrips = () => {
  // Örnek geçmiş turlar
  const trips = [
    { id: 1, destination: 'California MMA Camp', date: '2024-08-15' },
    { id: 2, destination: 'Thailand Muay Thai Experience', date: '2023-12-10' },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Previous Trips</Typography>
      <List>
        {trips.map(trip => (
          <ListItem key={trip.id} divider>
            <ListItemText
              primary={trip.destination}
              secondary={`Date: ${trip.date}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PreviousTrips;
