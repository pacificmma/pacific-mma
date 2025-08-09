// src/components/HeroWVideo.tsx - HYBRID VIDEO + FALLBACK SYSTEM
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from './Header';

const firstHeroVideo = '/assets/videos/first_hero_video.mp4';
const fallbackImage = '/assets/img/home_page/video_poster.jpg';

const Hero = () => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set up video for maximum compatibility
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = false;
    video.preload = 'metadata';

    // Fallback timeout - if video doesn't start in 3 seconds, show fallback
    fallbackTimeoutRef.current = setTimeout(() => {
      if (video.paused || video.readyState < 3) {
        console.warn('Video not playing after 3 seconds, showing fallback');
        setShowFallback(true);
      }
    }, 3000);

    // Try to play immediately
    const tryPlay = async () => {
      try {
        await video.play();
        // Video started successfully, clear fallback timeout
        if (fallbackTimeoutRef.current) {
          clearTimeout(fallbackTimeoutRef.current);
        }
        setShowFallback(false);
        setVideoFailed(false);
      } catch (error) {
        console.warn('Auto-play failed, will retry on user interaction:', error);
      }
    };

    // Event listeners for video state
    const onLoadedData = () => {
      tryPlay();
    };

    const onCanPlay = () => {
      tryPlay();
    };

    const onPlay = () => {
      setShowFallback(false);
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };

    const onPause = () => {
      // If video pauses unexpectedly, try to restart
      setTimeout(() => {
        if (video && video.paused && !videoFailed) {
          tryPlay();
        }
      }, 100);
    };

    const onError = () => {
      console.error('Video failed to load');
      setVideoFailed(true);
      setShowFallback(true);
    };

    const onStalled = () => {
      console.warn('Video stalled');
      setShowFallback(true);
      // Try to recover after a moment
      setTimeout(() => {
        if (video && video.readyState >= 2) {
          tryPlay();
        }
      }, 1000);
    };

    // Attach event listeners
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError);
    video.addEventListener('stalled', onStalled);

    // Visibility change handler
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !videoFailed) {
        setTimeout(() => {
          if (video && video.paused) {
            tryPlay();
          }
        }, 500);
      }
    };

    // User interaction handler
    const onUserInteraction = () => {
      if (!videoFailed && video && video.paused) {
        tryPlay();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('touchstart', onUserInteraction, { once: true });
    document.addEventListener('click', onUserInteraction, { once: true });

    // Initial load attempt
    video.load();
    
    return () => {
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
      
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError);
      video.removeEventListener('stalled', onStalled);
      
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('touchstart', onUserInteraction);
      document.removeEventListener('click', onUserInteraction);
    };
  }, [videoFailed]);

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
      
      {/* Video Layer */}
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
        {/* Video Element */}
        <video
          ref={videoRef}
          src={firstHeroVideo}
          poster={fallbackImage}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: showFallback ? 0 : 1,
            transition: 'opacity 0.5s ease',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Fallback Background - Animated Static Image */}
        {showFallback && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${fallbackImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: showFallback ? 1 : 0,
              transition: 'opacity 0.5s ease',
              // Subtle animation to give life to static image
              animation: 'slowPan 20s ease-in-out infinite alternate',
              '@keyframes slowPan': {
                '0%': { transform: 'scale(1.0) translateX(0%)' },
                '100%': { transform: 'scale(1.05) translateX(-2%)' },
              },
            }}
          />
        )}

        {/* Dim Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.3)',
            pointerEvents: 'none',
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
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

      {/* Debug indicator - Development only */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            position: 'fixed',
            top: 10,
            right: 10,
            display: 'flex',
            gap: 1,
            zIndex: 9999,
          }}
        >
          {/* Video status */}
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: videoRef.current?.paused === false ? 'green' : 'red',
              border: '1px solid white',
              opacity: 0.8,
            }}
            title="Video Status"
          />
          {/* Fallback status */}
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: showFallback ? 'orange' : 'transparent',
              border: '1px solid white',
              opacity: 0.8,
            }}
            title="Fallback Status"
          />
        </Box>
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