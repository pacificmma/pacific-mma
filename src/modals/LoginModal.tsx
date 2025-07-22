import React, { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
  Link,
} from '@mui/material'; // 🔧 FIX: Removed unused 'Divider' import (10:3)
import CloseIcon from '@mui/icons-material/Close';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';
import ResetPasswordModal from './ResetPasswordModal';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useFirebaseAuth();
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetOpen, setResetOpen] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    onClose();
  };

  // 🔧 FIX: Removed unused handlePasswordReset function (52:9)
  // Reset password functionality is handled by ResetPasswordModal

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setResetMessage('');
    setResetError('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <>
      <Box sx={style} component="form" onSubmit={handleEmailLogin}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">LOG IN</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

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
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          sx={{ '& label': { color: theme.palette.text.primary } }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        {resetError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {resetError}
          </Typography>
        )}

        {resetMessage && (
          <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
            {resetMessage}
          </Typography>
        )}

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
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <Box textAlign="center" mt={2}>
          <Box textAlign="center" mt={2}>
            <Link
              component="button"
              variant="body2"
              underline="always"
              onClick={() => setResetOpen(true)}
              sx={{ color: theme.palette.primary.main }}
            >
              Forgot your password?
            </Link>
          </Box>

        </Box>
      </Box>
      <ResetPasswordModal open={resetOpen} onClose={() => setResetOpen(false)} />
      </>
    </Modal>
    
  );
};

export default LoginModal;