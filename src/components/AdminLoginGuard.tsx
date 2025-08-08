import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import axios from 'axios';

interface AdminLoginGuardProps {
  children: React.ReactNode;
}

const AdminLoginGuard: React.FC<AdminLoginGuardProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin access is already granted
    const adminAccess = localStorage.getItem('adminAccess');
    if (adminAccess === 'true') {
      setHasAccess(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
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
        setHasAccess(true);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your connection.');
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundColor: theme.palette.primary.main,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '1rem' : '2rem',
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : isLargeScreen ? "h3" : "h4"} 
          sx={{ 
            color: theme.palette.primary.contrastText,
            textAlign: 'center',
            fontSize: {
              xs: '1.5rem',
              sm: '2rem', 
              md: '2.5rem',
              lg: '3rem',
              xl: '3.5rem'
            }
          }}
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!hasAccess) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundColor: theme.palette.primary.main,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: {
            xs: '1rem',
            sm: '1.5rem', 
            md: '2rem',
            lg: '3rem',
            xl: '4rem'
          },
          overflow: 'hidden',
        }}
      >
        {/* Coming Soon Başlığı */}
        <Typography
          sx={{
            color: theme.palette.primary.contrastText,
            fontWeight: 'bold',
            marginBottom: {
              xs: '1.5rem',
              sm: '2rem',
              md: '2.5rem', 
              lg: '3rem',
              xl: '3.5rem'
            },
            textAlign: 'center',
            fontSize: {
              xs: '1.8rem',
              sm: '2.5rem',
              md: '3rem',
              lg: '3.5rem',
              xl: '4.5rem'
            },
            lineHeight: 1.2,
            wordBreak: 'keep-all',
            px: 1
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
            gap: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
              lg: 3
            },
            width: '100%',
            maxWidth: {
              xs: '300px',
              sm: '350px',
              md: '400px', 
              lg: '450px',
              xl: '500px'
            },
            backgroundColor: theme.palette.primary.contrastText,
            borderRadius: {
              xs: '8px',
              sm: '12px',
              md: '16px'
            },
            padding: {
              xs: '1.5rem',
              sm: '2rem',
              md: '2.5rem',
              lg: '3rem'
            },
            boxShadow: {
              xs: '0 4px 15px rgba(0, 0, 0, 0.3)',
              sm: '0 8px 20px rgba(0, 0, 0, 0.4)',
              md: '0 12px 30px rgba(0, 0, 0, 0.5)'
            },
          }}
        >
          <Typography
            sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
              textAlign: 'center',
              fontSize: {
                xs: '1.2rem',
                sm: '1.4rem',
                md: '1.6rem',
                lg: '1.8rem',
                xl: '2rem'
              },
              lineHeight: 1.3
            }}
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
            InputLabelProps={{ 
              style: { 
                color: theme.palette.text.primary,
                fontSize: isMobile ? '0.9rem' : isLargeScreen ? '1.1rem' : '1rem'
              } 
            }}
            InputProps={{
              sx: {
                input: { 
                  color: theme.palette.text.primary,
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                    md: '1.1rem',
                    lg: '1.2rem'
                  },
                  padding: {
                    xs: '12px 14px',
                    sm: '14px 16px', 
                    md: '16px 18px'
                  }
                },
                '& fieldset': { 
                  borderColor: '#5A1F22',
                  borderWidth: isMobile ? '1px' : '2px'
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.secondary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.secondary.main,
                }
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: theme.palette.secondary.main,
              fontWeight: 'bold',
              fontSize: {
                xs: '0.9rem',
                sm: '1rem',
                md: '1.1rem',
                lg: '1.2rem'
              },
              padding: {
                xs: '10px 20px',
                sm: '12px 24px',
                md: '14px 28px',
                lg: '16px 32px'
              },
              borderRadius: {
                xs: '6px',
                sm: '8px',
                md: '10px'
              },
              '&:hover': { 
                backgroundColor: theme.palette.secondary.dark,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Preview
          </Button>

          {error && (
            <Typography
              sx={{ 
                color: theme.palette.error?.main || theme.palette.text.primary, 
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.9rem',
                  md: '1rem'
                },
                textAlign: 'center',
                fontWeight: 500,
                lineHeight: 1.4,
                px: 1
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AdminLoginGuard;