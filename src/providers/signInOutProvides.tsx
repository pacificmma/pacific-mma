// src/components/SignInOutButtons.tsx

import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useFirebaseAuth } from '../providers/fireBaseAuthProvider';

export default function SignInOutButtons() {
  const { user, logout, showLoginModal, loading } = useFirebaseAuth();

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (user) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <Typography>Hello, {user.displayName || user.email}</Typography>
        <Button variant="outlined" color="secondary" onClick={logout}>
          Sign out
        </Button>
      </Box>
    );
  }

  return (
    <Button variant="contained" color="secondary" onClick={showLoginModal}>
      Sign in
    </Button>
  );
}
