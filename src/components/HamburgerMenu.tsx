// src/components/HamburgerMenu.tsx
import { useState } from 'react';
import { Box, Typography, IconButton, Button, useTheme, Collapse, SvgIcon, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Instagram from '@mui/icons-material/Instagram';
import YouTube from '@mui/icons-material/YouTube';
import AccountCircle from '@mui/icons-material/AccountCircle';

// TikTok ve X (Twitter) ikonları için custom SVG componentleri
const TikTokIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.33 6.33 0 0 0 10.86-4.43V7.83a8.24 8.24 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.2-.26z" />
  </SvgIcon>
);

const XIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);
import menuItems from '../utils/menuItems.json';
import { useRouter } from 'next/router';
const logo = '/assets/logo/pacific_mma_logo_circle.png';

type HamburgerMenuProps = {
  toggleDrawer: () => void;
};

const HamburgerMenu = ({ toggleDrawer }: HamburgerMenuProps) => {
  const theme = useTheme();
  const router = useRouter(); // Initialize useRouter
  // Removed: const location = useLocation();
  const currentPath = router.pathname; // Use router.pathname
  const isSmallScreen = useMediaQuery('(max-width:360px)');

  // User menu open/close state
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const toggleUserMenu = () => setUserMenuOpen((prev) => !prev);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100dvh', // Dynamic viewport height with fallback
        '@supports not (height: 100dvh)': {
          minHeight: '100vh', // Fallback for older browsers
        },
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '1rem', sm: '1.5rem' },
        position: 'relative',
        overflowY: 'auto',
      }}
    >
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'absolute',
          top: { xs: 12, sm: 16 },
          right: { xs: 12, sm: 16 },
          color: theme.palette.primary.contrastText,
          zIndex: 10,
        }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: { xs: 4, sm: 6 },
          maxWidth: { xs: '280px', sm: '320px', md: '350px' },
          width: '100%',
        }}
      >
        {/* Logo ve PACIFIC MMA yazısı */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: { xs: '0.8rem', sm: '1rem' },
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt="Pacific MMA Logo"
            style={{ 
              height: isSmallScreen ? '40px' : '60px', 
              objectFit: 'contain' 
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.contrastText,
              fontFamily: theme.typography.fontFamily,
              fontSize: { 
                xs: '1.2rem', 
                sm: '1.5rem', 
                md: '1.8rem' 
              },
            }}
          >
            PACIFIC MMA
          </Typography>
        </Box>
        <Box
          sx={{
            maxWidth: { xs: '260px', sm: '300px', md: '400px' },
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: { 
                xs: '1.2rem', 
                sm: '1.5rem', 
                md: '2rem', 
                lg: '2.5rem' 
              },
              fontWeight: 600,
              color: theme.palette.primary.contrastText,
            }}
          >
            TRAVEL&TRAIN
          </Box>

          <Box
            sx={{
              transform: 'scaleX(0.9)',
              fontSize: { 
                xs: '1rem', 
                sm: '1.3rem', 
                md: '1.6rem', 
                lg: '2rem' 
              },
              fontWeight: 400,
              color: theme.palette.primary.contrastText,
              display: 'inline-block',
            }}
          >
            MIXED MARTIAL ARTS
          </Box>
        </Box>


      </Box>

      {/* Tüm menü itemları için tek container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: { xs: '280px', sm: '320px', md: '350px' },
          gap: { xs: 1, sm: 1.5 },
          mt: { xs: 3, sm: 4 }
        }}
      >
        {/* Home Button */}
        <Button
          fullWidth
          onClick={() => {
            router.push('/');
            toggleDrawer();
          }}
          sx={{
            color: currentPath === '/' ? theme.palette.secondary.main : theme.palette.primary.contrastText,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            textTransform: 'none',
            justifyContent: 'flex-start',
            minHeight: { xs: '36px', sm: '40px', md: '44px' },
            py: { xs: 1, sm: 1.5 }
          }}
        >
          Home
        </Button>

        {/* Camp Button */}
        <Button
          fullWidth
          onClick={() => {
            router.push('/camp');
            toggleDrawer();
          }}
          sx={{
            color: currentPath === '/camp' ? theme.palette.secondary.main : theme.palette.primary.contrastText,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            textTransform: 'none',
            justifyContent: 'flex-start',
            minHeight: { xs: '36px', sm: '40px', md: '44px' },
            py: { xs: 1, sm: 1.5 },
          }}
        >
          Camp
        </Button>

        {/* Youth Camp Button */}
        <Button
          fullWidth
          onClick={() => {
            router.push('/youth-camp');
            toggleDrawer();
          }}
          sx={{
            color: currentPath === '/youth-camp' ? theme.palette.secondary.main : theme.palette.primary.contrastText,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            textTransform: 'none',
            justifyContent: 'flex-start',
            minHeight: { xs: '36px', sm: '40px', md: '44px' },
            py: { xs: 1, sm: 1.5 },
          }}
        >
          Youth Camp
        </Button>

        {/* Diğer menü itemları */}
        {menuItems
          .filter((item) => item.label !== 'Home' && item.label !== 'Camp' && item.label !== 'Youth Camp')
          .map((item, index) => (
            <Button
              key={index}
              fullWidth
              onClick={() => {
                if (item.label === 'Contact' && currentPath === '/') {
                  // Scroll to contact section if on homepage
                  toggleDrawer();
                  setTimeout(() => {
                    const contactSection = document.getElementById('contact-section');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 300);
                } else if (item.label === 'Contact') {
                  // Navigate to homepage then scroll to contact
                  router.push('/');
                  toggleDrawer();
                  setTimeout(() => {
                    const contactSection = document.getElementById('contact-section');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 800);
                } else {
                  router.push(item.link);
                  toggleDrawer();
                }
              }}
              sx={{
                color: currentPath === item.link ? theme.palette.secondary.main : theme.palette.primary.contrastText,
                fontWeight: theme.typography.button.fontWeight,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                textTransform: 'none',
                justifyContent: 'flex-start',
                minHeight: { xs: '36px', sm: '40px', md: '44px' },
                py: { xs: 1, sm: 1.5 },
              }}
            >
              {item.label}
            </Button>
          ))}
      </Box>

      {/* User Menu Start */}
      {/* <Box sx={{ width: '100%', maxWidth: '300px', mt: 2 }}>
        <Button
          fullWidth
          startIcon={<AccountCircle />}
          onClick={toggleUserMenu}
          sx={{
            justifyContent: 'flex-start',
            color: theme.palette.primary.contrastText,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: theme.typography.button.fontSize,
            textTransform: 'none',
            mb: 1,
          }}
        >
          Account
        </Button>
        <Collapse in={userMenuOpen} timeout="auto" unmountOnExit>
          <Button
            fullWidth
            onClick={() => {
              router.push('/login');
              toggleDrawer();
            }}
            sx={{
              justifyContent: 'flex-start',
              color: currentPath === '/login' ? theme.palette.secondary.main : theme.palette.primary.contrastText,
              fontWeight: theme.typography.button.fontWeight,
              fontSize: theme.typography.button.fontSize,
              textTransform: 'none',
              mb: 1,
              }}
          >
            Login
          </Button>
          <Button
            fullWidth
            onClick={() => {
              router.push('/signup');
              toggleDrawer();
            }}
            sx={{
              justifyContent: 'flex-start',
              color: currentPath === '/signup' ? theme.palette.secondary.main : theme.palette.primary.contrastText,
              fontWeight: theme.typography.button.fontWeight,
              fontSize: theme.typography.button.fontSize,
              textTransform: 'none',
              mb: 1,
              }}
          >
            Sign Up
          </Button>
        </Collapse>
      </Box> */}
      {/* User Menu End */}

      {/* Book Button */}
      <Box sx={{ width: '100%', maxWidth: { xs: '200px', sm: '220px', md: '240px' }, mt: 2, mx: 'auto' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            router.push('/book');
            toggleDrawer();
          }}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            borderRadius: '25px',
            minHeight: { xs: '40px', sm: '42px' },
            py: { xs: 1, sm: 1.2 },
            px: { xs: 2, sm: 2.5 },
            '&:hover': { backgroundColor: theme.palette.secondary.dark },
          }}
        >
          Book
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, color: theme.palette.primary.contrastText }}>
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
    </Box>
  );
};

export default HamburgerMenu;