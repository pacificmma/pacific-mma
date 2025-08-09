// src/components/HeroWVideo.tsx - BULLETPROOF FALLBACK SOLUTION
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from './Header';

// Tamamen güvenilir gradyan background çözümü
const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: { xs: '60vh', sm: '70vh', md: '45vh', lg: '45vh' },
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        // Güvenilir gradyan background - hiçbir zaman fail olmaz
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main} 0%, 
          ${theme.palette.primary.dark} 35%, 
          #1a1a1a 70%, 
          ${theme.palette.primary.main} 100%)`,
      }}
    >
      <Header />

      {/* Animated Pattern Background - Always works */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255,255,255,0.1) 35px,
            rgba(255,255,255,0.1) 70px
          )`,
          animation: 'patternMove 20s linear infinite',
          '@keyframes patternMove': {
            '0%': { transform: 'translateX(-70px)' },
            '100%': { transform: 'translateX(0px)' },
          },
        }}
      />

      {/* Darker Overlay for better text contrast */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Text Content */}
      <Box
        sx={{
          position: 'absolute',
          zIndex: 2,
          textAlign: 'center',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            // Subtle text animation
            animation: 'textGlow 4s ease-in-out infinite alternate',
            '@keyframes textGlow': {
              '0%': { 
                textShadow: '0 0 10px rgba(255,255,255,0.3)' 
              },
              '100%': { 
                textShadow: '0 0 20px rgba(255,255,255,0.2), 0 0 30px rgba(255,255,255,0.1)' 
              },
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2rem', md: '4.5rem' },
              lineHeight: 1,
              letterSpacing: { xs: '0.15em', sm: '0.12em', md: '0.1em' },
              color: theme.palette.primary.contrastText,
              textTransform: 'none',
              fontFamily: theme.typography.fontFamily,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            TRAVEL&TRAIN
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2rem', md: '4.5rem' },
              lineHeight: 1,
              letterSpacing: { xs: '0.15em', sm: '0.12em', md: '0.1em' },
              color: theme.palette.secondary.main,
              textTransform: 'none',
              fontFamily: theme.typography.fontFamily,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              transform: 'scaleX(0.62)',
              transformOrigin: 'center',
            }}
          >
            Mixed Martial Arts (MMA)
          </Typography>
        </Box>
      </Box>

      {/* Success Indicator - Always Blue for Gradient Mode */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            position: 'fixed',
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: '#00ff00', // Bright green - gradient mode active
            border: '2px solid white',
            zIndex: 9999,
            opacity: 0.9,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.9, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.1)' },
              '100%': { opacity: 0.9, transform: 'scale(1)' },
            },
          }}
          title="Gradient Background Active - Never Fails"
        />
      )}

      {/* SVG Wave */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -5,
          left: 0,
          width: '100%',
          lineHeight: 0,
          zIndex: 3,
        }}
      >
        <svg
          viewBox="0 0 1440 120"
          width="100%"
          height="120px"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <path
            fill={theme.palette.background.paper}
            d="M0,60 C360,120 1080,120 1440,60 L1440,120 L0,120 Z"
          />
          <path
            fill="none"
            stroke={theme.palette.secondary.main}
            strokeWidth="8"
            d="M0,60 C360,120 1080,120 1440,60"
          />
        </svg>
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '5px',
          background: theme.palette.background.paper,
          zIndex: 2,
        }}
      />
    </Box>
  );
};

export default Hero;