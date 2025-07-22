import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';

const ContactUs = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fields: Array<keyof typeof formData> = ['name', 'email', 'message'];

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://23ail7r21i.execute-api.us-west-2.amazonaws.com/production/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage('Thank you! We received your message.');
        setSnackbarSeverity('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSnackbarMessage(`Error: ${data.message}`);
        setSnackbarSeverity('error');
      }
    } catch {
      setSnackbarMessage('Something went wrong. Please try again later.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: 4,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: `5px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: { xs: 4, md: 6 },
          width: '100%',
          maxWidth: { xs: '100%', md: '80%' },
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: 'center', md: 'left' },
            pr: { md: 6 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
              lineHeight: 1.4,
              letterSpacing: '1px',
              color: theme.palette.text.primary,
              marginBottom: 2,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Contact Us
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              fontSize: theme.typography.body1.fontSize,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Do you have questions about our tours, academy, or products? Are you interested in
            joining our network of trainers and gyms? If so, please send us a message and our team will get back to you as soon as possible.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxWidth: { xs: '100%', md: 500 },
            width: '100%',
            mt: { xs: 4, md: 0 },
          }}
        >
          {fields.map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              variant="standard"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange(field)}
              multiline={field === 'message'}
              rows={field === 'message' ? 4 : 1}
              InputLabelProps={{ sx: { color: theme.palette.text.primary } }}
              InputProps={{ disableUnderline: false, sx: { color: theme.palette.text.primary } }}
              sx={{
                '& .MuiInput-underline:before': { borderBottom: `1px solid ${theme.palette.text.primary}` },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: `2px solid ${theme.palette.text.primary}` },
                '& .MuiInput-underline:after': { borderBottom: `2px solid ${theme.palette.text.primary}` },
              }}
              fullWidth
              required
            />
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
                padding: '12px 30px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                borderRadius: '30px',
                '&:hover': { backgroundColor: theme.palette.secondary.dark },
              }}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUs;