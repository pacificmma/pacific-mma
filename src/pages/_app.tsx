// src/pages/_app.tsx
import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme'; // Path to your theme.js
import { FirebaseAuthProvider } from '../providers/fireBaseAuthProvider'; // Path to your Firebase Auth Provider
import { CartProvider } from '../providers/cartProvider'; // Path to your Cart Provider
import "@/styles/globals.css"; // Your global CSS imports

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </ThemeProvider>
    </FirebaseAuthProvider>
  );
}