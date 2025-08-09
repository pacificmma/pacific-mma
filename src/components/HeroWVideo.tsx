// src/components/HeroWVideo.tsx
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from './Header';

const firstHeroVideo = '/assets/videos/first_hero_video.mp4';

const Hero = () => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const waitForCanPlay = (video: HTMLVideoElement) =>
    new Promise<void>((resolve) => {
      if (video.readyState >= 2) return resolve();
      const onReady = () => resolve();
      video.addEventListener('canplay', onReady, { once: true });
    });

  const nudge = async (video: HTMLVideoElement) => {
    try {
      video.currentTime = Math.max(0, video.currentTime + 0.001);
    } catch {}
  };

  const ensureVideoPlays = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return false;

    try {
      if (playPromiseRef.current) {
        await playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }

      video.muted = true;
      video.loop = true;
      video.playsInline = true; // <-- any yok
      video.preload = 'auto';

      if (video.readyState < 2) {
        video.load();
        await waitForCanPlay(video);
      }

      playPromiseRef.current = video.play();
      await playPromiseRef.current;
      setIsPlaying(true);
      return true;
    } catch {
      try {
        const v = videoRef.current;
        if (!v) return false;
        await nudge(v);
        playPromiseRef.current = v.play();
        await playPromiseRef.current;
        setIsPlaying(true);
        return true;
      } catch {
        setIsPlaying(false);
        return false;
      }
    }
  }, []);

  const initializeVideo = useCallback(() => {
    if (!videoRef.current) return;
    void ensureVideoPlays();
  }, [ensureVideoPlays]);

  const handleVisibilityChange = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.visibilityState === 'visible') {
      void ensureVideoPlays();
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, [ensureVideoPlays]);

  const handleUserInteraction = useCallback(() => {
    void ensureVideoPlays();
  }, [ensureVideoPlays]);

  useEffect(() => {
    const timer = setTimeout(initializeVideo, 100);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    // bfcache dönüşünü doğru type ile ele al
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        void ensureVideoPlays();
      } else {
        void ensureVideoPlays();
      }
    };
    const onPageHide = () => {
      videoRef.current?.pause();
      setIsPlaying(false);
    };
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('pagehide', onPageHide);

    // interaction listener’ları sürekli açık
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [initializeVideo, handleVisibilityChange, handleUserInteraction, ensureVideoPlays]);

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
        m: 0,
        p: 0,
        background: theme.palette.background.paper,
      }}
    >
      <Header />

      {/* Video Layer */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <video
          ref={videoRef}
          poster="/assets/img/home_page/video_poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          onLoadedData={() => void ensureVideoPlays()}
          onCanPlay={() => void ensureVideoPlays()}
          onPlay={() => {
            setIsPlaying(true);
            try { videoRef.current?.removeAttribute('poster'); } catch {}
          }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => void ensureVideoPlays()}
          onStalled={() => void ensureVideoPlays()}
        >
          <source src={firstHeroVideo} type="video/mp4" />
        </video>

        {/* Dim Overlay (video üzerine filter yerine) */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.2)',
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
      <Box sx={{ position: 'absolute', bottom: -5, left: 0, width: '100%', lineHeight: 0, zIndex: 3 }}>
        <svg viewBox="0 0 1440 120" width="100%" height="120px" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block' }}>
          <path fill={theme.palette.background.paper} d="M0,60 C360,120 1080,120 1440,60 L1440,120 L0,120 Z" />
          <path fill="none" stroke={theme.palette.secondary.main} strokeWidth="8" d="M0,60 C360,120 1080,120 1440,60" />
        </svg>
      </Box>
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', background: theme.palette.background.paper, zIndex: 2 }} />
    </Box>
  );
};

export default Hero;
