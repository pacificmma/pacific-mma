// src/components/HeroWVideo.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from './Header';

// ✅ Next.js compatible asset import - use public folder path
const firstHeroVideo = '/assets/videos/first_hero_video.mp4';

const Hero = () => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // iPad/Safari video recovery system
  const resetVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
      video.load(); // Reload video source
      setTimeout(() => {
        video.play().then(() => {
          setIsVideoPlaying(true);
          setVideoError(false);
        }).catch(() => {
          setVideoError(true);
        });
      }, 100);
    } catch (error) {
      console.warn('Video reset failed:', error);
      setVideoError(true);
    }
  };

  // Enhanced visibility and focus handling
  const handleVideoRecovery = () => {
    const video = videoRef.current;
    if (!video) return;

    // Clear existing timeout
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
    }

    // Check if video needs recovery
    if (video.paused || video.ended || video.readyState < 2) {
      // Try simple play first
      video.play().catch(() => {
        // If play fails, do full reset
        playbackTimeoutRef.current = setTimeout(() => {
          resetVideo();
        }, 500);
      });
    }
  };

  useEffect(() => {
    // ✅ FIX: Only run on client-side
    if (typeof document === 'undefined') return;

    const video = videoRef.current;
    if (!video) return;

    // Multiple event listeners for comprehensive recovery
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(handleVideoRecovery, 200);
      }
    };

    const handleWindowFocus = () => {
      setTimeout(handleVideoRecovery, 200);
    };

    const handleVideoError = () => {
      setVideoError(true);
      resetVideo();
    };

    const handleVideoStall = () => {
      console.warn('Video stalled, attempting recovery...');
      resetVideo();
    };

    const handleVideoWaiting = () => {
      // Video is waiting for more data
      setTimeout(() => {
        if (video.readyState < 3) {
          resetVideo();
        }
      }, 3000);
    };

    const handleVideoPlay = () => {
      setIsVideoPlaying(true);
      setVideoError(false);
    };

    const handleVideoPause = () => {
      setIsVideoPlaying(false);
    };

    // Add all event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('stalled', handleVideoStall);
    video.addEventListener('waiting', handleVideoWaiting);
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);

    // Initial video load check
    setTimeout(() => {
      if (video.paused && !videoError) {
        handleVideoRecovery();
      }
    }, 1000);

    return () => {
      // ✅ FIX: Safe cleanup
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleWindowFocus);
      }
      
      if (video) {
        video.removeEventListener('error', handleVideoError);
        video.removeEventListener('stalled', handleVideoStall);
        video.removeEventListener('waiting', handleVideoWaiting);
        video.removeEventListener('play', handleVideoPlay);
        video.removeEventListener('pause', handleVideoPause);
      }

      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
    };
  }, []);

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
          height: 'calc(100% - 2px)',
          overflow: 'hidden',
        }}
      >
        <Box
          component="video"
          ref={videoRef}
          src={firstHeroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          webkit-playsinline="true"
          x5-playsinline="true"
          crossOrigin="anonymous"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.8)',
            // iPad/Safari optimizations
            WebkitTransform: 'translateZ(0)', // Hardware acceleration
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Prevent video flickering on iOS
            WebkitPerspective: 1000,
            perspective: 1000,
            // Force video layer
            willChange: 'transform',
          }}
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