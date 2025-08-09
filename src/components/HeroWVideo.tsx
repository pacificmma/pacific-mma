// src/components/HeroWVideo.tsx - BULLETPROOF VIDEO SYSTEM
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from './Header';

const firstHeroVideo = '/assets/videos/first_hero_video.mp4';

const Hero = () => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // Force play function with promise handling
  const ensureVideoPlays = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return false;

    try {
      // Cancel any existing play promise
      if (playPromiseRef.current) {
        await playPromiseRef.current.catch(() => {});
      }

      // Ensure video is ready
      if (video.readyState < 2) {
        video.load();
        await new Promise((resolve) => {
          if (video.readyState >= 2) resolve(true);
          else video.addEventListener('canplay', resolve, { once: true });
        });
      }

      // Start playing
      playPromiseRef.current = video.play();
      await playPromiseRef.current;
      setIsPlaying(true);
      return true;
    } catch (error) {
      console.warn('Video play failed:', error);
      return false;
    }
  }, []);

  // Initialize video with user interaction
  const initializeVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set optimal properties
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';

    // Try to play immediately
    ensureVideoPlays();
  }, [ensureVideoPlays]);

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      const video = videoRef.current;
      if (video && video.paused) {
        ensureVideoPlays();
      }
    }
  }, [ensureVideoPlays]);

  // Handle user interaction
  const handleUserInteraction = useCallback(() => {
    ensureVideoPlays();
  }, [ensureVideoPlays]);

  useEffect(() => {
    // Initialize on mount
    const timer = setTimeout(initializeVideo, 100);

    // Listen for app state changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    // Listen for user interactions (for iOS/Safari)
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [initializeVideo, handleVisibilityChange, handleUserInteraction]);

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
        background: theme.palette.background.paper,
      }}
    >
      <Header />
      
      {/* Video container */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          src={firstHeroVideo}
          poster="/assets/img/home_page/video_poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          webkit-playsinline="true"
          x5-playsinline="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.8)',
            // Hardware acceleration
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          onLoadedData={() => ensureVideoPlays()}
          onCanPlay={() => ensureVideoPlays()}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => ensureVideoPlays()}
          onStalled={() => ensureVideoPlays()}
        />
      </Box>

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
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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

      {/* Development debug indicator */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            position: 'fixed',
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: isPlaying ? 'green' : 'orange',
            border: '2px solid white',
            zIndex: 9999,
            opacity: 0.7,
          }}
        />
      )}

      {/* SVG wave */}
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