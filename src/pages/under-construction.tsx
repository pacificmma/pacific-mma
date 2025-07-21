import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const UnderConstructionPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: theme.palette.primary.contrastText,
          fontFamily: theme.typography.fontFamily,
          textAlign: 'center',
        }}
      >
        Under Construction.
      </Typography>
    </Box>
  );
};

export default UnderConstructionPage;
