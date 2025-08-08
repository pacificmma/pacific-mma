// src/pages/_app.tsx - UPDATED WITH AUTH MODALS CONTAINER
import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';
import { FirebaseAuthProvider } from '../providers/fireBaseAuthProvider';
import { CartProvider } from '../providers/cartProvider';
import AuthModalsContainer from '../components/AuthModalsContainer';
import AdminLoginGuard from '../components/AdminLoginGuard';
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          <AdminLoginGuard>
            {/* 🎯 Main Application */}
            <Component {...pageProps} />
            
            {/* 🔐 Authentication Modals - Global seviyede */}
            <AuthModalsContainer />
          </AdminLoginGuard>
        </CartProvider>
      </ThemeProvider>
    </FirebaseAuthProvider>
  );
}