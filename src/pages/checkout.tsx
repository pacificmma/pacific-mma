import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Stack,
  useTheme,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MultiStepForm from '../components/AccountCreationForm';

const CheckoutPage = () => {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleContinue = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setStep(2);
  };

  const handleBackToEmail = () => {
    setStep(1);
    setEmail('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Sticky header with primary color bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          width: '100%',
        }}
      >
        <Box
          sx={{
            height: '80px',
            backgroundColor: theme.palette.primary.main,
          }}
        />
        <Header />
      </Box>

      {/* Step 1 & 2 container */}
      {(step === 1 || step === 2) && (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            px: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: 600,
              width: '100%',
              p: 4,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              textAlign: 'center',
            }}
          >
            {step === 1 && (
              <>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, letterSpacing: '2px' }}>
                  CHECKOUT
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Enter your email address to proceed
                </Typography>
                <TextField
                  fullWidth
                  label="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  sx={{ mb: 3 }}
                  InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleContinue}
                  sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                  CONTINUE
                </Button>

                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 3, color: theme.palette.text.primary }}
                >
                  <LockIcon sx={{ mr: 1 }} fontSize="small" />
                  <Typography variant="caption">All data is kept secure</Typography>
                </Stack>
              </>
            )}

            {step === 2 && (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Welcome <strong>{email}</strong>
                </Typography>

                <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: 'bold' }}>
                  NEW CUSTOMER CHECKOUT
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Become a member for exclusive benefits — it's free.
                </Typography>

                <Box sx={{ textAlign: 'left', mb: 4 }}>
                  <Typography sx={{ mb: 1 }}>✔ Exclusive event invites</Typography>
                  <Typography>✔ Order history access</Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ py: 1.5, fontWeight: 'bold', mb: 3 }}
                  onClick={() => setStep(3)}
                >
                  CONTINUE TO CHECKOUT
                </Button>

                <Box sx={{ mt: 3 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleBackToEmail}
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    USE ANOTHER EMAIL ADDRESS
                  </Link>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}

      {/* Step 3 kendi container'ında */}
      {step === 3 && (
        <Box
          sx={{
            flexGrow: 1,
            p: 4,
            width: '100%',
          }}
        >
          <MultiStepForm email={email} />
        </Box>
      )}

      <Footer />
    </Box>
  );
};

export default CheckoutPage;
