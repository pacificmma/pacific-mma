import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { z } from 'zod';
import theme from '@/theme';

const notifySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

interface NotifyMeProps {
  destinationCountry: string;
  destinationTitle: string;
}

export default function NotifyMe({ destinationCountry, destinationTitle }: NotifyMeProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setError('');
      setSuccess(false);
      setValidationErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setValidationErrors({});
      
      const validatedData = notifySchema.parse(formData);
      
      setLoading(true);

      const response = await fetch('/api/notify-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...validatedData,
          destinationCountry,
          destinationTitle,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit notification request');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '' });
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        err.issues.forEach(e => {
          if (e.path[0]) {
            errors[e.path[0] as string] = e.message;
          }
        });
        setValidationErrors(errors);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        size="large"
        startIcon={<NotificationsActiveIcon />}
        onClick={handleOpen}
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 'bold',
          textTransform: 'none',
          borderRadius: 2,
          px: 4,
          py: 1.5,
          boxShadow: 3,
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
            boxShadow: 5,
          },
        }}
      >
        Notify Me When Available
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationsActiveIcon sx={{ color: theme.palette.secondary.main }} />
            <Typography variant="h6">Get Notified</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.primary" mb={3}>
              We'll notify you as soon as the <strong>{destinationCountry}</strong> tour becomes available. 
              Please provide your contact information below.
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you! We'll notify you when this tour becomes available.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              disabled={loading || success}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { color: theme.palette.text.primary } }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={loading || success}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { color: theme.palette.text.primary } }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
              disabled={loading || success}
              placeholder="+1 234 567 8900"
              InputLabelProps={{ style: { color: theme.palette.text.primary } }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || success}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: theme.palette.primary.contrastText }} /> : null}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              },
            }}
          >
            {loading ? 'Submitting...' : 'Notify Me'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}