import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  TextField,
  useTheme,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import Header from '../components/Header';
import { useCart, useCartItems, useCartTotal, useCartStatus } from '../providers/cartProvider';
import { useRouter } from 'next/router';

function CartPage() {
  const theme = useTheme();
  const router = useRouter();
  const cartItems = useCartItems();
  const { totalPrice } = useCartTotal();
  const { updateQuantity, removeItem } = useCart();
  const { isLoading, error, lastSyncTime } = useCartStatus();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🎯 Sync durumu göstergesi
  const renderSyncStatus = () => {
    if (isLoading) {
      return (
        <Chip 
          icon={<CircularProgress size={16} />}
          label="Senkronize ediliyor..."
          color="info"
          size="small"
          sx={{ mb: 2 }}
        />
      );
    }

    if (error) {
      return (
        <Chip 
          icon={<CloudOffIcon />}
          label="Bağlantı hatası"
          color="error"
          size="small"
          sx={{ mb: 2 }}
        />
      );
    }

    if (lastSyncTime) {
      return (
        <Chip 
          icon={<CloudDoneIcon />}
          label="Senkronize edildi"
          color="success"
          size="small"
          sx={{ mb: 2 }}
        />
      );
    }

    return null;
  };

  return (
    <>
      <Header />

      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 10,
          textAlign: 'center',
          mb: 4,
          borderRadius: '0 0 40% 40% / 30%',
          boxShadow: `0 4px 12px ${theme.palette.primary.dark}aa`,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          Your Shopping Cart
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Review your selected items before checkout
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>

        {cartItems.length === 0 ? (
          <Box
            sx={{
              minHeight: '50vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme.palette.text.primary,
              px: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Your cart is currently empty.
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Browse our shop and add some products to your cart.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              href="/gear"
              sx={{ borderRadius: '20px', px: 4 }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            {cartItems.map((item) => (
              <Paper
                key={item.cartItemId}
                elevation={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  mb: 2,
                  borderRadius: '12px',
                  gap: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    elevation: 6,
                    transform: 'translateY(-2px)',
                  },
                  // Sync durumunda opacity efekti
                  opacity: isLoading ? 0.8 : 1,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: '8px',
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {item.name} / Color: {item.color} Size: {item.size}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                    Price: ${item.price.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    type="number"
                    label="Qty"
                    size="small"
                    inputProps={{ min: 1, max: 99 }}
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = Math.max(1, Math.min(99, Number(e.target.value)));
                      updateQuantity(item.cartItemId!, qty);
                    }}
                    sx={{ width: 80 }}
                    InputLabelProps={{
                      style: { color: theme.palette.text.primary },
                    }}
                    disabled={isLoading}
                  />

                  <IconButton
                    aria-label="remove"
                    color="error"
                    onClick={() => removeItem(item.cartItemId!)}
                    disabled={isLoading}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.error.light + '20',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in cart
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: theme.typography.fontWeightBold }}>
                Total: ${totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: '20px', px: 4 }}
                onClick={() => router.push('/checkout')}
                disabled={isLoading || cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default CartPage;