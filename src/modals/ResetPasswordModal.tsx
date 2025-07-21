import React, { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../utils/fireBaseAuthProvider';

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

type ResetPasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

const ResetPasswordModal = ({ open, onClose }: ResetPasswordModalProps) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async () => {
    setMessage('');
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent successfully.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send reset email.');
    }
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Reset Password</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" mb={2}>
          Enter your email address to receive a password reset link.
        </Typography>

        <TextField
          label="Email"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ '& label': { color: theme.palette.text.primary }, mb: 2 }}
        />

        {error && <Typography color="error" variant="body2" mb={1}>{error}</Typography>}
        {message && <Typography color="success.main" variant="body2" mb={1}>{message}</Typography>}

        <Button
          fullWidth
          variant="contained"
          onClick={handleReset}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            '&:hover': { backgroundColor: theme.palette.secondary.dark },
          }}
        >
          Send Reset Link
        </Button>
      </Box>
    </Modal>
  );
};

export default ResetPasswordModal;
