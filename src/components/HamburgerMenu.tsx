import { useState } from 'react';
import { Box, Typography, IconButton, Button, useTheme, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Instagram from '@mui/icons-material/Instagram';
import Facebook from '@mui/icons-material/Facebook';
import Twitter from '@mui/icons-material/Twitter';
import AccountCircle from '@mui/icons-material/AccountCircle';
import menuItems from '../utils/menuItems.json';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo/pacific_mma_logo.jpg';

type HamburgerMenuProps = {
  toggleDrawer: () => void;
};

const HamburgerMenu = ({ toggleDrawer }: HamburgerMenuProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Kullanıcı menüsü açma kapama durumu
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const toggleUserMenu = () => setUserMenuOpen((prev) => !prev);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: 2, sm: 3 },
        position: 'relative',
        overflowY: 'auto',
      }}
    >
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: theme.palette.text.primary,
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
          marginTop: 6,
          maxWidth: '300px',
          width: '100%',
        }}
      >
        <img
          src={logo}
          alt="Pacific MMA Logo"
          style={{ height: '80px', marginBottom: '1rem', objectFit: 'contain' }}
        />
        <Typography
          textAlign="center"
          variant="h6"
          sx={{
            fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
            lineHeight: { xs: 1.4, sm: 1.4 },
            letterSpacing: '1px',
            color: theme.palette.text.primary,
            textTransform: 'none',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: theme.typography.fontFamily,
          }}
        >
          "Travel the world and train martial arts"
        </Typography>
      </Box>

      <Box sx={{ mt: 4, width: '100%', maxWidth: '300px' }}>
        {/* Home Button First */}
        <Button
          fullWidth
          onClick={() => {
            navigate('/');
            toggleDrawer();
          }}
          sx={{
            color: currentPath === '/' ? theme.palette.secondary.main : theme.palette.text.primary,
            mb: 2,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: theme.typography.button.fontSize,
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { color: theme.palette.primary.main },
          }}
        >
          Home
        </Button>

        {/* Camp Buttons */}
        <Button
          fullWidth
          onClick={() => {
            navigate('/camp');
            toggleDrawer();
          }}
          sx={{
            color: currentPath === '/camp' ? theme.palette.secondary.main : theme.palette.text.primary,
            mb: 2,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: theme.typography.button.fontSize,
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { color: theme.palette.primary.main },
          }}
        >
          Camp
        </Button>

        <Button
          fullWidth
          onClick={() => {
            navigate('/youth-camp');
            toggleDrawer();
          }}
          sx={{
            color: currentPath === '/youth-camp' ? theme.palette.secondary.main : theme.palette.text.primary,
            mb: 2,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: theme.typography.button.fontSize,
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { color: theme.palette.primary.main },
          }}
        >
          Youth Camp
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '300px', mt: 2 }}>
        {menuItems
          .filter((item) => item.label !== 'Home' && item.label !== 'Camp' && item.label !== 'Youth Camp')
          .map((item, index) => (
            <Button
              key={index}
              fullWidth
              onClick={() => {
                navigate(item.link);
                toggleDrawer();
              }}
              sx={{
                color: currentPath === item.link ? theme.palette.secondary.main : theme.palette.text.primary,
                mb: 2,
                fontWeight: theme.typography.button.fontWeight,
                fontSize: theme.typography.button.fontSize,
                textTransform: 'none',
                justifyContent: 'flex-start',
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              {item.label}
            </Button>
          ))}
      </Box>

      {/* Kullanıcı Menüsü Başlangıcı */}
      <Box sx={{ width: '100%', maxWidth: '300px', mt: 2 }}>
        <Button
          fullWidth
          startIcon={<AccountCircle />}
          onClick={toggleUserMenu}
          sx={{
            justifyContent: 'flex-start',
            color: theme.palette.text.primary,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: theme.typography.button.fontSize,
            textTransform: 'none',
            mb: 1,
            '&:hover': { color: theme.palette.primary.main },
          }}
        >
          Account
        </Button>
        <Collapse in={userMenuOpen} timeout="auto" unmountOnExit>
          <Button
            fullWidth
            onClick={() => {
              navigate('/login');
              toggleDrawer();
            }}
            sx={{
              justifyContent: 'flex-start',
              color: currentPath === '/login' ? theme.palette.secondary.main : theme.palette.text.primary,
              fontWeight: theme.typography.button.fontWeight,
              fontSize: theme.typography.button.fontSize,
              textTransform: 'none',
              mb: 1,
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            Login
          </Button>
          <Button
            fullWidth
            onClick={() => {
              navigate('/signup');
              toggleDrawer();
            }}
            sx={{
              justifyContent: 'flex-start',
              color: currentPath === '/signup' ? theme.palette.secondary.main : theme.palette.text.primary,
              fontWeight: theme.typography.button.fontWeight,
              fontSize: theme.typography.button.fontSize,
              textTransform: 'none',
              mb: 1,
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            Sign Up
          </Button>
        </Collapse>
      </Box>
      {/* Kullanıcı Menüsü Sonu */}

      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1, color: theme.palette.text.primary }}>
          Follow us on social media:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <IconButton sx={{ color: theme.palette.text.primary }}>
            <Instagram />
          </IconButton>
          <IconButton sx={{ color: theme.palette.text.primary }}>
            <Facebook />
          </IconButton>
          <IconButton sx={{ color: theme.palette.text.primary }}>
            <Twitter />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default HamburgerMenu;
