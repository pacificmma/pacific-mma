// src/components/Header.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import menuItems from '../utils/menuItems.json';
import HamburgerMenu from './HamburgerMenu';
import { CartContext } from '../providers/cartProvider';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';
import Link from 'next/link'; // next/link import
import { useRouter } from 'next/router'; // next/router import

const Header = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anchorElCamps, setAnchorElCamps] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const cartContext = useContext(CartContext);

  // Firebase Auth hook values
  const { user, loading, logout, showLoginModal, showSignUpModal } = useFirebaseAuth();

  // Cart item count
  const cartItemCount = cartContext?.state?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  // Scroll position effect
  useEffect(() => {
    const onScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Drawer toggle
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  // Menu handlers
  const handleMenuOpenCamps = (e: React.MouseEvent<HTMLElement>) => setAnchorElCamps(e.currentTarget);
  const handleMenuCloseCamps = () => setAnchorElCamps(null);
  const handleMenuOpenUser = (e: React.MouseEvent<HTMLElement>) => setAnchorElUser(e.currentTarget);
  const handleMenuCloseUser = () => setAnchorElUser(null);

  // Use router.pathname for current path
  const currentPath = router.pathname;

  // Firebase Auth operations
  const handleLogout = async () => {
    handleMenuCloseUser();
    
    try {
      await logout();
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  const handleLogin = () => {
    handleMenuCloseUser();
    showLoginModal();
  };

  const handleSignUp = () => {
    handleMenuCloseUser();
    showSignUpModal();
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.fullName || user.email?.split('@')[0] || 'User';
  };

  // Check if user is authenticated
  const isAuthenticated = !!user && !loading;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrollPosition > 50 ? theme.palette.primary.main : 'transparent',
          boxShadow: scrollPosition > 50 ? theme.shadows[4] : 'none',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: '80px' }}>
          {isMobile && (
            <IconButton 
              edge="start" 
              aria-label="menu" 
              onClick={toggleDrawer} 
              sx={{ color: theme.palette.text.secondary }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Site Title Link */}
          <Link
            href="/" // Use href
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              textDecoration: 'none',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.text.secondary,
                ml: 2,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              Pacific MMA
            </Typography>
          </Link>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Home Button */}
              <Link href="/" passHref>
                <Button
                  component="a" // Use component="a" when wrapping Link around MUI Button
                  sx={{
                    color: currentPath === '/' ? theme.palette.secondary.main : theme.palette.text.secondary,
                    fontWeight: theme.typography.button.fontWeight,
                    fontSize: theme.typography.button.fontSize,
                    borderRadius: '20px',
                    px: 2,
                    minHeight: '40px',
                    '&:hover': { color: theme.palette.secondary.main },
                  }}
                >
                  Home
                </Button>
              </Link>

              {/* Camps Dropdown */}
              <Box>
                <Button
                  onClick={handleMenuOpenCamps}
                  sx={{
                    color: ['/camp', '/youth-camp'].includes(currentPath) 
                      ? theme.palette.secondary.main 
                      : theme.palette.text.secondary,
                    fontWeight: theme.typography.button.fontWeight,
                    fontSize: theme.typography.button.fontSize,
                    borderRadius: '20px',
                    px: 2,
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { color: theme.palette.secondary.main },
                  }}
                >
                  Camps <ArrowDropDownIcon sx={{ ml: 1 }} />
                </Button>
                <Menu
                  anchorEl={anchorElCamps}
                  open={Boolean(anchorElCamps)}
                  onClose={handleMenuCloseCamps}
                  MenuListProps={{ onMouseLeave: handleMenuCloseCamps }}
                >
                  <Link href="/camp" passHref>
                    <MenuItem
                      component="a" // Use component="a"
                      onClick={handleMenuCloseCamps}
                      sx={{
                        color: currentPath === '/camp' 
                          ? theme.palette.secondary.main 
                          : theme.palette.text.primary,
                        fontWeight: theme.typography.button.fontWeight,
                        fontSize: theme.typography.button.fontSize,
                        '&:hover': { color: theme.palette.secondary.main },
                      }}
                    >
                      Adult Camps
                    </MenuItem>
                  </Link>
                  <Link href="/youth-camp" passHref>
                    <MenuItem
                      component="a" // Use component="a"
                      onClick={handleMenuCloseCamps}
                      sx={{
                        color: currentPath === '/youth-camp' 
                          ? theme.palette.secondary.main 
                          : theme.palette.text.primary,
                        fontWeight: theme.typography.button.fontWeight,
                        fontSize: theme.typography.button.fontSize,
                        '&:hover': { color: theme.palette.secondary.main },
                      }}
                    >
                      Youth Camps
                    </MenuItem>
                  </Link>
                </Menu>
              </Box>

              {/* Other Menu Items */}
              {menuItems
                .filter((item) => !['Home', 'Camp', 'Youth Camp'].includes(item.label))
                .map((item, index) => (
                  <Link href={item.link} passHref key={index}>
                    <Button
                      component="a" // Use component="a"
                      sx={{
                        color: currentPath === item.link 
                          ? theme.palette.secondary.main 
                          : theme.palette.text.secondary,
                        fontWeight: theme.typography.button.fontWeight,
                        fontSize: theme.typography.button.fontSize,
                        borderRadius: '20px',
                        px: 2,
                        minHeight: '40px',
                        '&:hover': { color: theme.palette.secondary.main },
                      }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Shopping Cart */}
            <IconButton
              aria-label="cart"
              onClick={() => router.push('/cart')}
              sx={{ 
                color: theme.palette.text.secondary, 
                '&:hover': { color: theme.palette.secondary.main } 
              }}
            >
              <Badge 
                badgeContent={cartItemCount} 
                color="error" 
                invisible={cartItemCount === 0} 
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* User Authentication Section */}
            {loading ? (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Loading...
              </Typography>
            ) : isAuthenticated ? (
              <>
                <Button
                  onClick={handleMenuOpenUser}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ 
                    color: theme.palette.text.secondary, 
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': { color: theme.palette.secondary.main }
                  }}
                >
                  {getUserDisplayName()}
                </Button>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleMenuCloseUser}
                  MenuListProps={{ onMouseLeave: handleMenuCloseUser }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Link href="/profile" passHref>
                    <MenuItem
                      component="a" // Use component="a"
                      onClick={handleMenuCloseUser}
                      sx={{
                        color: currentPath === '/profile' 
                          ? theme.palette.secondary.main 
                          : theme.palette.text.primary,
                        fontWeight: theme.typography.button.fontWeight,
                        fontSize: theme.typography.button.fontSize,
                        '&:hover': { color: theme.palette.secondary.main },
                      }}
                    >
                      Profile
                    </MenuItem>
                  </Link>
                  <Link href="/orders" passHref>
                    <MenuItem
                      component="a" // Use component="a"
                      onClick={handleMenuCloseUser}
                      sx={{
                        color: currentPath === '/orders' 
                          ? theme.palette.secondary.main 
                          : theme.palette.text.primary,
                        fontWeight: theme.typography.button.fontWeight,
                        fontSize: theme.typography.button.fontSize,
                        '&:hover': { color: theme.palette.secondary.main },
                      }}
                    >
                      My Orders
                    </MenuItem>
                  </Link>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: theme.typography.button.fontWeight,
                      fontSize: theme.typography.button.fontSize,
                      '&:hover': { color: theme.palette.secondary.main },
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <IconButton
                  aria-label="user account"
                  onClick={handleMenuOpenUser}
                  sx={{ 
                    color: theme.palette.text.secondary, 
                    '&:hover': { color: theme.palette.secondary.main } 
                  }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleMenuCloseUser}
                  MenuListProps={{ onMouseLeave: handleMenuCloseUser }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem
                    onClick={handleLogin}
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: theme.typography.button.fontWeight,
                      fontSize: theme.typography.button.fontSize,
                      '&:hover': { color: theme.palette.secondary.main },
                    }}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    onClick={handleSignUp}
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: theme.typography.button.fontWeight,
                      fontSize: theme.typography.button.fontSize,
                      '&:hover': { color: theme.palette.secondary.main },
                    }}
                  >
                    Sign Up
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* Book Now Button */}
            <Button
              variant="contained"
              onClick={() => router.push('/book')}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: theme.typography.button.fontWeight,
                fontSize: theme.typography.button.fontSize,
                borderRadius: '20px',
                px: 2,
                minHeight: '40px',
                '&:hover': { backgroundColor: theme.palette.secondary.dark },
              }}
            >
              Book Now
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <HamburgerMenu toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
};

export default Header;