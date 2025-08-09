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
  const recoveryAttemptRef = useRef<number>(0);
  const lastPlayTimeRef = useRef<number>(0);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const forceRecoveryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const [showMobileDebug, setShowMobileDebug] = useState(false);

  // Mobile-friendly debug logging - only in development
  const mobileLog = (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
      setDebugInfo(prev => {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = `[${timestamp}] ${message}`;
        // Keep only last 3 logs for mobile display
        const logs = prev.split('\n').slice(-2);
        return [...logs, newLog].join('\n');
      });
    }
  };

  // Enhanced video recovery system
  const resetVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    mobileLog('Resetting video...');
    try {
      // Force video to restart completely
      video.pause();
      video.currentTime = 0;
      video.load(); // Reload video source
      
      // Fast multiple attempts with minimal delay
      const attemptPlay = (attempt: number = 0) => {
        if (attempt > 2) {
          console.error('Max reset attempts reached');
          setVideoError(true);
          return;
        }

        setTimeout(() => {
          video.play().then(() => {
            mobileLog(`Video reset successful on attempt ${attempt + 1}`);
            setIsVideoPlaying(true);
            setVideoError(false);
            lastPlayTimeRef.current = Date.now();
            recoveryAttemptRef.current = 0;
          }).catch((error) => {
            mobileLog(`Video reset attempt ${attempt + 1} failed: ${error.message}`);
            attemptPlay(attempt + 1);
          });
        }, 100 * (attempt + 1)); // Faster progressive delay
      };

      attemptPlay();
    } catch (error) {
      console.error('Video reset failed:', error);
      setVideoError(true);
    }
  };

  // Enhanced visibility and focus handling with improved recovery
  const handleVideoRecovery = () => {
    const video = videoRef.current;
    if (!video) return;

    // Clear existing timeout
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
    }

    // Limit recovery attempts to prevent infinite loops
    if (recoveryAttemptRef.current > 3) {
      console.warn('Maximum recovery attempts reached, stopping video recovery');
      setVideoError(true);
      return;
    }

    const currentTime = Date.now();
    const timeSinceLastPlay = currentTime - lastPlayTimeRef.current;

    // Check if video needs recovery
    if (video.paused || video.ended || video.readyState < 2 || timeSinceLastPlay > 30000) {
      recoveryAttemptRef.current++;
      mobileLog(`Video recovery attempt ${recoveryAttemptRef.current}`);

      // For mobile browsers, try different recovery strategies
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile && timeSinceLastPlay > 2000) {
        // For mobile after short pause, do full reset
        resetVideo();
      } else {
        // Try simple play first
        video.play().then(() => {
          mobileLog('Simple play recovery successful');
          setIsVideoPlaying(true);
          setVideoError(false);
          lastPlayTimeRef.current = currentTime;
          recoveryAttemptRef.current = 0; // Reset counter on success
        }).catch((error) => {
          mobileLog(`Video play failed: ${error.message}`);
          // If play fails, do full reset with minimal delay
          playbackTimeoutRef.current = setTimeout(() => {
            resetVideo();
          }, 200);
        });
      }
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
        mobileLog('Page became visible, attempting video recovery');
        // Reset recovery attempts when page becomes visible
        recoveryAttemptRef.current = 0;
        setTimeout(handleVideoRecovery, 100);
      } else {
        // Page became hidden, track the time
        mobileLog('Page became hidden');
        lastPlayTimeRef.current = Date.now();
      }
    };

    const handleWindowFocus = () => {
      mobileLog('Window focused, attempting video recovery');
      recoveryAttemptRef.current = 0;
      setTimeout(handleVideoRecovery, 100);
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // Handle browser back/forward navigation
      if (event.persisted) {
        mobileLog('Page shown from cache, attempting video recovery');
        recoveryAttemptRef.current = 0;
        setTimeout(handleVideoRecovery, 150);
      }
    };

    const handleVideoError = () => {
      mobileLog('Video error occurred');
      setVideoError(true);
      setIsVideoPlaying(false);
      resetVideo();
    };

    const handleVideoPlay = () => {
      setIsVideoPlaying(true);
      setVideoError(false);
      lastPlayTimeRef.current = Date.now();
      recoveryAttemptRef.current = 0; // Reset on successful play
    };

    const handleVideoPause = () => {
      setIsVideoPlaying(false);
      lastPlayTimeRef.current = Date.now();
    };

    const handleVideoTimeUpdate = () => {
      // Update last play time periodically during playback
      lastPlayTimeRef.current = Date.now();
      
      // Ensure playing state is correct during timeupdate
      if (!isVideoPlaying) {
        setIsVideoPlaying(true);
      }
    };

    const handleVideoStalled = () => {
      mobileLog('Video stalled, attempting recovery...');
      setIsVideoPlaying(false);
      resetVideo();
    };

    const handleVideoWaiting = () => {
      mobileLog('Video waiting for data...');
      setIsVideoPlaying(false);
      // Video is waiting for more data
      setTimeout(() => {
        const currentVideo = videoRef.current;
        if (currentVideo && currentVideo.readyState < 3) {
          resetVideo();
        }
      }, 3000);
    };

    // Intersection Observer to detect when video is in view
    const setupIntersectionObserver = () => {
      if (!videoContainerRef.current || intersectionObserverRef.current) return;

      intersectionObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log('Video container is visible, checking playback');
              setTimeout(() => {
                const video = videoRef.current;
                if (video && video.paused) {
                  console.log('Video is paused while visible, attempting recovery');
                  handleVideoRecovery();
                }
              }, 500);
            }
          });
        },
        { threshold: 0.5 } // Trigger when 50% of video is visible
      );

      intersectionObserverRef.current.observe(videoContainerRef.current);
    };

    // Ultra-aggressive recovery check every 500ms
    const setupForceRecoveryInterval = () => {
      forceRecoveryIntervalRef.current = setInterval(() => {
        const video = videoRef.current;
        if (!video) return;

        const timeSinceLastPlay = Date.now() - lastPlayTimeRef.current;
        
        // Ultra-aggressive recovery - immediate response
        if (document.visibilityState === 'visible') {
          // If video shows as playing but hasn't updated time in 800ms
          if (timeSinceLastPlay > 800) {
            setIsVideoPlaying(false);
            handleVideoRecovery();
          }
          
          // If video is paused but should be playing - immediate
          else if (video.paused && isVideoPlaying) {
            setIsVideoPlaying(false);
            handleVideoRecovery();
          }
          
          // If video element exists but readyState is low - immediate
          else if (video.readyState < 2 && timeSinceLastPlay > 500) {
            handleVideoRecovery();
          }
        }
      }, 500); // Check every 500ms
    };

    // Add all event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('pageshow', handlePageShow);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('stalled', handleVideoStalled);
    video.addEventListener('waiting', handleVideoWaiting);
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);
    video.addEventListener('timeupdate', handleVideoTimeUpdate);

    // Setup additional monitoring
    setupIntersectionObserver();
    setupForceRecoveryInterval();

    // Initial video load check with multiple attempts
    const initialLoadCheck = () => {
      setTimeout(() => {
        mobileLog('Initial load check');
        if (video.paused && !videoError) {
          mobileLog('Video paused on load, attempting recovery');
          handleVideoRecovery();
        } else if (video.readyState < 2) {
          mobileLog('Video not ready, waiting...');
          setTimeout(initialLoadCheck, 1000);
        } else {
          mobileLog('Video loaded successfully');
          lastPlayTimeRef.current = Date.now();
        }
      }, 1000);
    };
    
    initialLoadCheck();

    return () => {
      // ✅ FIX: Safe cleanup
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('pageshow', handlePageShow);
      }
      
      if (video) {
        video.removeEventListener('error', handleVideoError);
        video.removeEventListener('stalled', handleVideoStalled);
        video.removeEventListener('waiting', handleVideoWaiting);
        video.removeEventListener('play', handleVideoPlay);
        video.removeEventListener('pause', handleVideoPause);
        video.removeEventListener('timeupdate', handleVideoTimeUpdate);
      }

      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }

      if (forceRecoveryIntervalRef.current) {
        clearInterval(forceRecoveryIntervalRef.current);
      }

      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectionObserverRef.current = null;
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
        ref={videoContainerRef}
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
          preload="metadata"
          webkit-playsinline="true"
          x5-playsinline="true"
          crossOrigin="anonymous"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          onContextMenu={(e) => e.preventDefault()}
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
            // Debug: ensure video is visible
            backgroundColor: 'rgba(255,0,0,0.1)', // Temporary red tint for debugging
            opacity: videoError ? 0.3 : 1,
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

      {/* Debug Toggle - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          onClick={() => setShowMobileDebug(!showMobileDebug)}
          sx={{
            position: 'fixed',
            top: 10,
            right: 10,
            width: 40,
            height: 40,
            backgroundColor: (() => {
              // Check actual video state, not just our state
              const video = videoRef.current;
              const timeSinceLastPlay = Date.now() - lastPlayTimeRef.current;
              
              if (videoError) return 'rgba(255,0,0,0.7)'; // Red for error
              if (!video) return 'rgba(128,128,128,0.7)'; // Gray for no video
              if (video.paused || timeSinceLastPlay > 800) return 'rgba(255,165,0,0.7)'; // Orange for paused/inactive
              if (isVideoPlaying && video.currentTime > 0 && !video.paused) return 'rgba(0,255,0,0.7)'; // Green for playing
              return 'rgba(255,165,0,0.7)'; // Default orange
            })(),
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            zIndex: 9999,
            cursor: 'pointer',
            border: '1px solid white',
            opacity: 0.8,
            animation: (() => {
              const video = videoRef.current;
              const timeSinceLastPlay = Date.now() - lastPlayTimeRef.current;
              // Blink if video is stuck
              if (video && !video.paused && timeSinceLastPlay > 800) {
                return 'blink 0.5s infinite';
              }
              return 'none';
            })(),
            '@keyframes blink': {
              '0%, 50%': { opacity: 0.8 },
              '51%, 100%': { opacity: 0.3 }
            }
          }}
        >
          🎥
        </Box>
      )}

      {/* Mobile Debug Panel - Only in development */}
      {process.env.NODE_ENV === 'development' && showMobileDebug && (
        <Box
          sx={{
            position: 'fixed',
            top: 70,
            right: 10,
            left: 10,
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: 2,
            borderRadius: 2,
            fontSize: '14px',
            zIndex: 9998,
            maxHeight: '200px',
            overflow: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Status:</span>
            <span>{isVideoPlaying ? '▶️ Playing' : '⏸️ Paused'}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Error:</span>
            <span>{videoError ? '❌ Error' : '✅ OK'}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Recovery:</span>
            <span>{recoveryAttemptRef.current}/3</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Ready State:</span>
            <span>{videoRef.current?.readyState || 'N/A'}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Video Paused:</span>
            <span>{videoRef.current?.paused ? '✅ Yes' : '❌ No'}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Current Time:</span>
            <span>{videoRef.current?.currentTime?.toFixed(1) || '0.0'}s</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Last Activity:</span>
            <span>{Math.floor((Date.now() - lastPlayTimeRef.current) / 1000)}s ago</span>
          </Box>
          <Box sx={{ mb: 1 }}>
            <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '8px' }}>Recent Logs:</div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', whiteSpace: 'pre-line' }}>
              {debugInfo}
            </div>
          </Box>
          <Box sx={{ textAlign: 'center', pt: 1, borderTop: '1px solid #333' }}>
            <Box
              component="button"
              onClick={(e) => {
                e.stopPropagation();
                mobileLog('Manual recovery triggered');
                handleVideoRecovery();
              }}
              sx={{
                backgroundColor: 'rgba(255,165,0,0.8)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              🔄 Force Recovery
            </Box>
          </Box>
        </Box>
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