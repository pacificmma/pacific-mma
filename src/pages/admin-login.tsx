import React, { useState } from 'react';
import { Box, TextField, Button, Typography, useTheme } from '@mui/material';
import axios from 'axios';

const ComingSoonPage = () => {
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'https://kq7g58bv6i.execute-api.us-west-2.amazonaws.com/production/',
        { password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const parsedBody = JSON.parse(res.data.body);

      if (parsedBody.success) {
        localStorage.setItem('adminAccess', 'true');
        window.location.reload();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your connection.');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: theme.palette.primary.main,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      {/* Coming Soon Başlığı */}
      <Typography
        variant="h3"
        sx={{
          color: theme.palette.primary.contrastText,
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        Under Construction
      </Typography>

      {/* Login Kutusu */}
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: '350px',
          backgroundColor: theme.palette.primary.contrastText,
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', color: theme.palette.text.primary, textAlign: 'center' }}
        >
          Access With Password
        </Typography>

        <TextField
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { color: theme.palette.text.primary } }}
          InputProps={{
            sx: {
              input: { color: theme.palette.text.primary, },
              '& fieldset': { borderColor: '#5A1F22' },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            fontWeight: 'bold',
            '&:hover': { backgroundColor: theme.palette.secondary.dark },
          }}
        >
          Preview
        </Button>

        {error && (
          <Typography
            sx={{ color: theme.palette.text.primary, fontSize: '0.9rem', textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ComingSoonPage;
