import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NetworkPage = () => {
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* En üstte yatay şerit */}
      <Box
        sx={{
          width: '100%',
          height: '200px', // yaklaşık 5 cm (200px = ~5.2cm ekrana göre)
          backgroundColor: theme.palette.primary.main,
        }}
      />

      <Header />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: theme.palette.text.primary,
          p: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          This page is under construction.
        </Typography>
      </Box>

      <Footer />
    </Box>
  );
};

export default NetworkPage;
