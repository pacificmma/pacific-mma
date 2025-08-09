// src/components/HeroWVideo.tsx - KILL-AND-REATTACH SOURCE (iOS-proof)
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from './Header';

const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${p}`;
const HERO_VIDEO_MP4_BASE = asset('/assets/videos/first_hero_video.mp4');
const HERO_POSTER = asset('/assets/img/home_page/video_poster.jpg');

const Hero: React.FC = () => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoKey, setVideoKey] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const ready = (v: HTMLVideoElement) =>
    new Promise<void>((resolve) => {
      if (v.readyState >= 2) return resolve();
      const onReady = () => resolve();
      v.addEventListener('canplay', onReady, { once: true });
    });

  const srcWithBuster = (k: number) => `${HERO_VIDEO_MP4_BASE}?k=${k}`;

  const attachAndPlay = useCallback(async (k: number) => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'auto';

    // Kaynağı tak
    // <source> kullanmak yerine direkt v.src set edilirse iOS'ta daha stabil olur
    v.src = srcWithBuster(k);
    v.load();
    await ready(v);

    try {
      await v.play();
      setIsPlaying(true);
      try { v.removeAttribute('poster'); } catch {}
    } catch {
      // küçük nudge
      try {
        v.currentTime = Math.max(0, v.currentTime + 0.001);
        await v.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  }, []);

  const detach = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    try { v.pause(); } catch {}
    // Kaynağı tamamen sök
    v.removeAttribute('src');
    // legacy <source> varsa temizle
    while (v.firstChild) v.removeChild(v.firstChild);
    v.load();
    setIsPlaying(false);
  }, []);

  // İlk mount: tak ve oynat
  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void attachAndPlay(videoKey); }, 50);
    return () => window.clearTimeout(timeoutId);
  }, [videoKey, attachAndPlay]);

  // Görünürlük değişimi: gizlenince sök, görünür olunca remount+attach
  const handleVisibility = useCallback(() => {
    if (document.visibilityState === 'visible') {
      // Hem remount et hem de yeni src ile tak
      setVideoKey((k) => k + 1);
    } else {
      detach();
    }
  }, [detach]);

  // bfcache dönüşü: aynı strateji (remount + reattach)
  const handlePageShow = useCallback((_e: PageTransitionEvent) => {
    setVideoKey((k) => k + 1);
  }, []);

  // Kullanıcı etkileşimi gelirse (autoplay politikasına takıldıysa) tekrar dene
  const handleUserInteraction = useCallback(() => {
    void attachAndPlay(videoKey);
  }, [attachAndPlay, videoKey]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    window.addEventListener('pageshow', handlePageShow);

    // Arka plana çıkarken kesin sök
    const onPageHide = () => detach();
    window.addEventListener('pagehide', onPageHide);

    // Interaction dinleyicileri
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [handleVisibility, handlePageShow, handleUserInteraction, detach]);

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
          key={videoKey} // remount
          ref={videoRef}
          poster={HERO_POSTER}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          // IMPORTANT: <source> çocuklarını kullanmıyoruz; iOS'ta doğrudan v.src daha stabil
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => { /* iOS beklerse, bir dahaki görünürlükte zaten reattach olacak */ }}
          onStalled={() => { /* same */ }}
        />

        {/* Overlay (filter yerine) */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', pointerEvents: 'none' }} />
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
