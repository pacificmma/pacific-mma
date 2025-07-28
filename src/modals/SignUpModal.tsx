// src/modals/SignUpModal.tsx - ORIGINAL DESIGN WITH FIREBASE AUTH
import React, { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  maxWidth: 450,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

type SignUpModalProps = {
  open: boolean;
  onClose: () => void;
};

const SignUpModal = ({ open, onClose }: SignUpModalProps) => {
  const theme = useTheme();
  const { register, loading, error, clearError } = useFirebaseAuth();
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  // Address state
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== passwordConfirm) {
      return;
    }
    
    if (!fullName || !email || !phone || !password || !streetAddress || !city || !state || !zipCode) {
      return;
    }

    const userData = {
      fullName: fullName.trim(),
      phoneNumber: phone.trim(),
      address: {
        street: streetAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        country: 'USA',
        zipCode: zipCode.trim(),
      },
    };

    await register(email.trim(), password, userData);
  };

  const handleClose = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setPasswordConfirm('');
    setStreetAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setShowPassword(false);
    setShowPasswordConfirm(false);
    clearError();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">SIGN UP</Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Personal Information */}
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={loading}
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        <TextField
          label="Phone Number"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={loading}
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          sx={{ '& label': { color: theme.palette.text.primary } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          type={showPasswordConfirm ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          disabled={loading}
          sx={{ '& label': { color: theme.palette.text.primary } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  edge="end"
                  disabled={loading}
                >
                  {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Address Information */}
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: theme.palette.text.primary }}>
          Address Information
        </Typography>

        <TextField
          label="Street Address"
          fullWidth
          margin="normal"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          required
          disabled={loading}
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="City"
            fullWidth
            margin="normal"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            disabled={loading}
            sx={{ '& label': { color: theme.palette.text.primary } }}
          />

          <TextField
            label="State"
            fullWidth
            margin="normal"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            disabled={loading}
            sx={{ '& label': { color: theme.palette.text.primary } }}
          />
        </Box>

        <TextField
          label="ZIP Code"
          fullWidth
          margin="normal"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          disabled={loading}
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 3,
            backgroundColor: theme.palette.secondary.main,
            '&:hover': { backgroundColor: theme.palette.secondary.dark },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Creating account...
            </Box>
          ) : (
            'Sign Up'
          )}
        </Button>
      </Box>
    </Modal>
  );
};

export default SignUpModal;