import React from 'react';
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Instagram, Facebook, Twitter } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        borderTop: `5px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h5" sx={{ fontWeight: theme.typography.h5.fontWeight, mb: 2, fontFamily: theme.typography.fontFamily }}>
          Stay in the Loop
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: theme.palette.primary.contrastText }}>
          Sign up with your email to receive news and updates.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <TextField
            variant="outlined"
            placeholder="Enter your email"
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: 1,
              height: '40px',
              '& input': {
                padding: '10px',
                fontSize: '0.9rem',
                height: '100%',
                boxSizing: 'border-box',
              }
            }}
            InputProps={{
              sx: {
                height: '40px',
              }
            }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: theme.typography.button.fontWeight,
              padding: '0.5rem 1.5rem',
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: theme.typography.body2.fontWeight, fontFamily: theme.typography.fontFamily }}>
          Follow us on social media:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <IconButton sx={{ color: theme.palette.primary.contrastText }}>
            <Instagram />
          </IconButton>
          <IconButton sx={{ color: theme.palette.primary.contrastText }}>
            <Facebook />
          </IconButton>
          <IconButton sx={{ color: theme.palette.primary.contrastText }}>
            <Twitter />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'right' } }}>
        <Typography variant="h5" sx={{ fontWeight: theme.typography.h5.fontWeight, mb: 2, fontFamily: theme.typography.fontFamily }}>
          Pacific MMA
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1265A Fairview Avenue <br />
          Redwood City, CA 94061
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 1, textDecoration: 'underline', cursor: 'pointer', color: theme.palette.secondary.main }}
        >
          info@pacificmma.com
        </Typography>
        <Typography
          variant="body2"
          sx={{ textDecoration: 'underline', cursor: 'pointer', color: theme.palette.secondary.main }}
        >
          (555) 555-5555
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;