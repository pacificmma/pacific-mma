// src/components/HeroWVideo.tsx — BULLETPROOF VIDEO SYSTEM (HARDENED)
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from './Header';

// --- SOURCES ---
const SRC_MP4_HD   = '/assets/videos/first_hero_video.mp4';
const SRC_MP4_LQ   = '/assets/videos/first_hero_video_lq.mp4';   // 720p/1.5-2Mbps
const SRC_WEBM_LQ  = '/assets/videos/first_hero_video_lq.webm';  // opsiyonel
const SRC_HLS      = '/assets/videos/first_hero_video.m3u8';     // varsa kullan

const Hero = () => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // progress watchdog
  const lastTimeRef = useRef(0);
  const lastStampRef = useRef<number>(0);
  const watchdogId = useRef<number | null>(null);

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const canUseHlsNatively = () => {
    const v = document.createElement('video') as any;
    return v.canPlayType('application/vnd.apple.mpegurl') === 'probably' ||
           v.canPlayType('application/vnd.apple.mpegurl') === 'maybe';
  };

  const waitForCanPlay = (video: HTMLVideoElement) =>
    new Promise<void>((resolve) => {
      if (video.readyState >= 2) return resolve();
      const onReady = () => resolve();
      video.addEventListener('canplay', onReady, { once: true });
    });

  const attachInlineAttrs = (video: HTMLVideoElement) => {
    // React props yetmeyebilir; attribute olarak zorla
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    (video as any).playsInline = true;
  };

  const setPrimarySources = (video: HTMLVideoElement) => {
    video.innerHTML = '';
    if (SRC_HLS && canUseHlsNatively()) {
      // Safari: native HLS
      const s = document.createElement('source');
      s.src = SRC_HLS;
      s.type = 'application/vnd.apple.mpegurl';
      video.appendChild(s);
    } else {
      // Progressive
      const s1 = document.createElement('source');
      s1.src = SRC_MP4_HD;
      s1.type = 'video/mp4';
      video.appendChild(s1);

      const s2 = document.createElement('source');
      s2.src = SRC_WEBM_LQ;
      s2.type = 'video/webm';
      video.appendChild(s2);
    }
  };

  const setFallbackSources = (video: HTMLVideoElement) => {
    video.innerHTML = '';
    // En güvenlisi düşük bitrate MP4
    const s = document.createElement('source');
    s.src = SRC_MP4_LQ;
    s.type = 'video/mp4';
    video.appendChild(s);
  };

  const hardReset = async (video: HTMLVideoElement, fallback = false) => {
    try {
      video.pause();
      // kaynakları yeniden tak
      if (fallback) {
        setFallbackSources(video);
      } else {
        setPrimarySources(video);
      }
      video.load();
      await waitForCanPlay(video);
    } catch {}
  };

  const nudge = async (video: HTMLVideoElement) => {
    try {
      // micro-seek iOS/Safari’ye iyi geliyor
      video.currentTime = Math.max(0, video.currentTime + 0.001);
    } catch {}
  };

  const safePlay = async (video: HTMLVideoElement) => {
    // önce varsa önceki play() promise’ini beklet
    if (playPromiseRef.current) {
      try { await playPromiseRef.current; } catch {}
      playPromiseRef.current = null;
    }
    attachInlineAttrs(video);
    video.muted = true;
    video.loop = true;
    video.preload = 'auto';
    playPromiseRef.current = video.play();
    await playPromiseRef.current;
    setIsPlaying(true);
  };

  const ensureVideoPlays = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return false;

    try {
      if (video.readyState < 2) {
        video.load();
        await waitForCanPlay(video);
      }
      await safePlay(video);
      setRetryCount(0);
      return true;
    } catch {
      try {
        const v = videoRef.current;
        if (!v) return false;
        await nudge(v);
        await safePlay(v);
        setRetryCount(0);
        return true;
      } catch {
        try {
          const v = videoRef.current;
          if (!v) return false;
          // hazır kaynağı koru; sadece hard reset
          await hardReset(v, usingFallback);
          await nudge(v);
          await safePlay(v);
          setRetryCount((c) => c + 1);
          return true;
        } catch {
          setIsPlaying(false);
          return false;
        }
      }
    }
  }, [usingFallback]);

  const switchToFallback = async () => {
    const v = videoRef.current;
    if (!v) return;
    setUsingFallback(true);
    await hardReset(v, true);
    await nudge(v);
    await safePlay(v);
  };

  const initializeVideo = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;

    // kaynakları ilk kez tak
    setPrimarySources(v);
    attachInlineAttrs(v);

    try {
      await ensureVideoPlays();
    } catch {
      // olmazsa fallback’e geç
      await switchToFallback();
    }
  }, [ensureVideoPlays]);

  // Visibility/focus
  const handleVisibilityChange = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (document.visibilityState === 'visible') {
      void ensureVideoPlays();
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [ensureVideoPlays]);

  const handleUserInteraction = useCallback(() => {
    void ensureVideoPlays();
  }, [ensureVideoPlays]);

  // Watchdog: ilerleme durduysa müdahale
  const startWatchdog = useCallback(() => {
    stopWatchdog();
    watchdogId.current = window.setInterval(async () => {
      const v = videoRef.current;
      if (!v) return;

      const now = performance.now();
      const ct = v.currentTime;

      const progressed = ct > lastTimeRef.current + 0.01; // 10ms üstü
      if (progressed) {
        lastTimeRef.current = ct;
        lastStampRef.current = now;
        return;
      }

      const elapsed = now - (lastStampRef.current || now);
      // 1.5s boyunca ilerleme yoksa nudge + play
      if (elapsed > 1500 && elapsed <= 4000) {
        try {
          await nudge(v);
          await safePlay(v);
        } catch {}
      }

      // 4s üstü ise hard reset; 2. defa da fallback
      if (elapsed > 4000) {
        try {
          if (retryCount < 1) {
            await hardReset(v, usingFallback);
            await nudge(v);
            await safePlay(v);
            setRetryCount((c) => c + 1);
            lastStampRef.current = performance.now();
          } else if (!usingFallback) {
            await switchToFallback();
            lastStampRef.current = performance.now();
          }
        } catch {}
      }
    }, 700);
  }, [retryCount, usingFallback]);

  const stopWatchdog = () => {
    if (watchdogId.current) {
      clearInterval(watchdogId.current);
      watchdogId.current = null;
    }
  };

  useEffect(() => {
    const t = setTimeout(() => { void initializeVideo(); }, 100);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    const onPageShow = (e: PageTransitionEvent) => {
      if (e?.persisted) void ensureVideoPlays();
      else void ensureVideoPlays();
    };
    const onPageHide = () => {
      const v = videoRef.current;
      if (v) v.pause();
      setIsPlaying(false);
    };
    window.addEventListener('pageshow', onPageShow as any);
    window.addEventListener('pagehide', onPageHide);

    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);

    startWatchdog();

    return () => {
      clearTimeout(t);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('pageshow', onPageShow as any);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      stopWatchdog();
    };
  }, [initializeVideo, handleVisibilityChange, handleUserInteraction, startWatchdog]);

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
          crossOrigin="anonymous"
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
            lastTimeRef.current = videoRef.current?.currentTime ?? 0;
            lastStampRef.current = performance.now();
          }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => void ensureVideoPlays()}
          onStalled={() => void ensureVideoPlays()}
          onError={() => {
            // kaynak hatasında direkt fallback'e in
            if (!usingFallback) void switchToFallback();
          }}
          onTimeUpdate={() => {
            lastTimeRef.current = videoRef.current?.currentTime ?? 0;
            lastStampRef.current = performance.now();
          }}
        />
        {/* Dim Overlay */}
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

      {/* Dev Debug Dot */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            position: 'fixed',
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: isPlaying ? 'green' : usingFallback ? 'gold' : 'orange',
            border: '2px solid white',
            zIndex: 9999,
            opacity: 0.7,
          }}
          title={usingFallback ? 'Fallback LQ' : 'Primary'}
        />
      )}

      {/* SVG Wave */}
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
