import React from 'react';
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Instagram, YouTube } from '@mui/icons-material';
import { SvgIcon } from '@mui/material';

// TikTok ve X (Twitter) ikonları için custom SVG componentleri
const TikTokIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.33 6.33 0 0 0 10.86-4.43V7.83a8.24 8.24 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.2-.26z"/>
  </SvgIcon>
);

const XIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </SvgIcon>
);

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
        borderTop: `6px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h5" sx={{ fontWeight: theme.typography.h5.fontWeight, mb: 2, fontFamily: theme.typography.fontFamily }}>
          Stay in the Loop
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: theme.palette.primary.contrastText }}>
          Sign up to receive news and updates.
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2 }, 
          justifyContent: { xs: 'center', md: 'flex-start' },
          alignItems: { xs: 'stretch', sm: 'center' },
          maxWidth: { xs: '100%', sm: '400px', md: 'none' },
          width: { xs: '100%', md: 'auto' }
        }}>
          <TextField
            variant="outlined"
            placeholder="Enter your email"
            type="email"
            inputMode="email"
            autoComplete="email"
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: 1,
              flex: { xs: 1, sm: 1 },
              minWidth: { xs: '100%', sm: '200px' },
              '& .MuiOutlinedInput-root': {
                height: { xs: '44px', sm: '40px', md: '42px' },
                fontSize: { xs: '16px', sm: '0.9rem' }, // 16px prevents zoom on iOS
              },
              '& input': {
                padding: { xs: '12px 14px', sm: '10px', md: '12px' },
                fontSize: { xs: '16px', sm: '0.9rem' },
                boxSizing: 'border-box',
              }
            }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: theme.typography.button.fontWeight,
              padding: { xs: '12px 24px', sm: '8px 16px', md: '10px 20px' },
              height: { xs: '44px', sm: '40px', md: '42px' },
              minWidth: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.95rem', sm: '0.875rem' },
              borderRadius: 1,
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
            <TikTokIcon />
          </IconButton>
          <IconButton sx={{ color: theme.palette.primary.contrastText }}>
            <Instagram />
          </IconButton>
          <IconButton sx={{ color: theme.palette.primary.contrastText }}>
            <XIcon />
          </IconButton>
          <IconButton sx={{ color: theme.palette.primary.contrastText }}>
            <YouTube />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'right' } }}>
        <Typography variant="h5" sx={{ fontWeight: theme.typography.h5.fontWeight, mb: 2, fontFamily: theme.typography.fontFamily }}>
          PACIFIC MMA
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1265A Fairview Avenue <br />
          Redwood City, CA 94061
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 1, textDecoration: 'underline', cursor: 'pointer', color: theme.palette.secondary.main, fontWeight: 'bold' }}
        >
          info@pacificmma.com
        </Typography>
        <Typography
          variant="body2"
          sx={{ textDecoration: 'underline', cursor: 'pointer', color: theme.palette.secondary.main, fontWeight: 'bold' }}
        >
          (555) 555-5555
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;