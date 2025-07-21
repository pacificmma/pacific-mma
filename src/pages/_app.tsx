// pages/_app.tsx dosyanızda
import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../src/theme'; // Kendi tema dosyanızın yolu
import { FirebaseAuthProvider } from '../src/providers/fireBaseAuthProvider'; // Kendi Firebase sağlayıcınızın yolu
import { CartProvider } from '../src/providers/cartProvider'; // Kendi sepet sağlayıcınızın yolu

function MyApp({ Component, pageProps }: AppProps) {
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

export default MyApp;