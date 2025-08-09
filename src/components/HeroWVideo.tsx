// src/components/HeroWVideo.tsx - REMOUNT-ON-RESUME HERO VIDEO (iOS-safe)
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from './Header';

const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${p}`;
const HERO_VIDEO_MP4 = asset('/assets/videos/first_hero_video.mp4');
const HERO_POSTER = asset('/assets/img/home_page/video_poster.jpg');

const Hero: React.FC = () => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Remount anahtarı: değişince <video> DOM'u sıfırdan yaratılır
  const [videoKey, setVideoKey] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const waitForCanPlay = (video: HTMLVideoElement) =>
    new Promise<void>((resolve) => {
      if (video.readyState >= 2) return resolve();
      const onReady = () => resolve();
      video.addEventListener('canplay', onReady, { once: true });
    });

  const nudge = (video: HTMLVideoElement) => {
    try { video.currentTime = Math.max(0, video.currentTime + 0.001); } catch {}
  };

  const tryPlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = 'auto';

      if (v.readyState < 2) {
        v.load();
        await waitForCanPlay(v);
      }
      await v.play();
      setIsPlaying(true);
    } catch {
      // küçük bir nudge sonrası tekrar dene
      try {
        nudge(v);
        await v.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false); // etkileşim gelince tekrar deneyeceğiz
      }
    }
  }, []);

  // Görünür olunca oynat
  const handleVisibility = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.visibilityState === 'visible') {
      void tryPlay();
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, [tryPlay]);

  // iOS/Safari geri dönüşte remount
  const handlePageShow = useCallback((e: PageTransitionEvent) => {
    // bfcache (persisted) veya normal dönüş — ikisinde de remount etmek güvenli
    setVideoKey((k) => k + 1);
  }, []);

  // Kullanıcı etkileşimi olursa (autoplay engelinde) tekrar dene
  const handleUserInteraction = useCallback(() => {
    void tryPlay();
  }, [tryPlay]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', () => {
      videoRef.current?.pause();
      setIsPlaying(false);
    });

    // Etkileşim dinleyicileri (once: false bırak)
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [handleVisibility, handlePageShow, handleUserInteraction]);

  // Yeni video DOM’u yaratıldıktan sonra oynatmayı dene
  useEffect(() => {
    let t = setTimeout(() => { void tryPlay(); }, 100);
    return () => clearTimeout(t);
  }, [videoKey, tryPlay]);

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
          key={videoKey}                // <-- kritik: remount anahtarı
          ref={videoRef}
          poster={HERO_POSTER}
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
          onLoadedData={() => void tryPlay()}
          onCanPlay={() => void tryPlay()}
          onPlay={() => {
            setIsPlaying(true);
            try { videoRef.current?.removeAttribute('poster'); } catch {}
          }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => void tryPlay()}
          onStalled={() => void tryPlay()}
        >
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>

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
