import { Box, Typography, IconButton, useTheme, useMediaQuery, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { destinations as originalDestinations } from '../utils/destinations';
import NewYorkPhoto from '../../assets/img/home_page/photo-newyork.jpg';
import SanFranciscoPhoto from '../../assets/img/home_page/photo-sanfrancisco.jpg';
import NevadaPhoto from '../../assets/img/home_page/photo-nevada.jpg';
import LasVegasPhoto from '../../assets/img/home_page/photo-lasvegas.jpg';
import JapanPhoto from '../../assets/img/home_page/photo-japan.jpg';
import ThailandPhoto from '../../assets/img/home_page/photo-thailand.jpg';

const customExperience = {
  country: 'Custom Experience',
  title: 'Design Your Custom Trip',
  nights: 'Flexible',
  image: [NewYorkPhoto, SanFranciscoPhoto, NevadaPhoto, LasVegasPhoto, JapanPhoto, ThailandPhoto],
  isSlideshow: true,
};

const destinations = [customExperience, ...originalDestinations];

// Sonsuz döngü için kartları çoğaltıyoruz
const infiniteDestinations = [...destinations, ...destinations, ...destinations];

const DestinationSlider = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [slideshowImageIndex, setSlideshowImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);

  const cardWidth = isMobile ? 240 + 16 : 350 + 16;
  const totalOriginalItems = destinations.length;
  const slidingDistance = cardWidth * totalOriginalItems;

  // Başlangıç pozisyonu - ortadaki set
  const initialPosition = -slidingDistance;

  // Smooth animation için position update
  const updatePosition = (newPosition: number) => {
    setCurrentPosition(newPosition);
  };

  // Desktop sonsuz animasyon fonksiyonu
  const startInfiniteAnimation = () => {
    if (!isPaused && !isMobile && isMountedRef.current) {
      const animate = () => {
        if (isPaused || isMobile || !isMountedRef.current) return;
        
        setCurrentPosition(prev => {
          const newPosition = prev - 2; // Daha yavaş hareket için 1 piksel
          
          // Eğer çok sola gittiyse, sessizce ortaya sıfırla
          if (newPosition <= -slidingDistance * 2) {
            return -slidingDistance;
          }
          
          return newPosition;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Animasyonu durdur
  const stopInfiniteAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Component mount edildiğinde animasyonu başlat
  useEffect(() => {
    isMountedRef.current = true;
    setCurrentPosition(initialPosition);
    
    if (!isMobile) {
      // Kısa bir delay ile başlat
      timeoutRef.current = setTimeout(() => {
        startInfiniteAnimation();
      }, 100);
    }

    return () => {
      isMountedRef.current = false;
      stopInfiniteAnimation();
    };
  }, [isMobile, initialPosition]);

  // Pause durumu değiştiğinde animasyonu kontrol et
  useEffect(() => {
    if (!isMobile && isMountedRef.current) {
      if (isPaused) {
        stopInfiniteAnimation();
      } else {
        // Mevcut pozisyondan devam et - kısa delay ile
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          startInfiniteAnimation();
        }, 100);
      }
    }
  }, [isPaused, isMobile]);

  // Mouse event handlers - individual card hover
  const handleCardMouseEnter = (index: number) => {
    if (!isMobile) {
      setHoveredCard(index);
      setIsPaused(true);
    }
  };

  const handleCardMouseLeave = () => {
    if (!isMobile) {
      setHoveredCard(null);
      setIsPaused(false);
    }
  };

  // Navigation handlers (desktop için)
  const handleNext = () => {
    if (!isMobile) {
      setIsPaused(true);
      const newPosition = currentPosition - cardWidth;
      setCurrentPosition(newPosition);

      // Sınır kontrolü
      if (newPosition <= -slidingDistance * 2) {
        setTimeout(() => {
          setCurrentPosition(-slidingDistance);
        }, 300);
      }

      // Kısa bir süre sonra animasyonu tekrar başlat
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 1000);
    }
  };

  const handlePrev = () => {
    if (!isMobile) {
      setIsPaused(true);
      const newPosition = currentPosition + cardWidth;
      setCurrentPosition(newPosition);

      // Sınır kontrolü
      if (newPosition >= 0) {
        setTimeout(() => {
          setCurrentPosition(-slidingDistance);
        }, 300);
      }

      // Kısa bir süre sonra animasyonu tekrar başlat
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 1000);
    }
  };

  // Drag handlers (mobil için)
  const handleDragStart = (event: any, info: any) => {
    if (isMobile) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    if (isMobile) {
      const dragDistance = info.offset.x;
      const threshold = 50;

      if (Math.abs(dragDistance) > threshold) {
        if (dragDistance > 0) {
          // Sağa sürükleme - önceki slide
          const newPosition = currentPosition + cardWidth;
          setCurrentPosition(newPosition);

          // Sınır kontrolü
          if (newPosition >= 0) {
            setTimeout(() => {
              setCurrentPosition(-slidingDistance);
            }, 300);
          }
        } else {
          // Sola sürükleme - sonraki slide
          const newPosition = currentPosition - cardWidth;
          setCurrentPosition(newPosition);

          // Sınır kontrolü
          if (newPosition <= -slidingDistance * 2) {
            setTimeout(() => {
              setCurrentPosition(-slidingDistance);
            }, 300);
          }
        }
      }

      setTimeout(() => setIsDragging(false), 100);
    }
  };

  // Slideshow resimleri
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideshowImageIndex((prev) => (prev + 1) % (customExperience.image.length || 1));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Kart tıklama handler
  const handleCardClick = (destination: any) => {
    if (!isDragging) {
      router.push(
        destination.isSlideshow
          ? '/book'
          : `/destination/${destination.country.toLowerCase().replace(/\s+/g, '-')}`
      );
    }
  };

  // Buton tıklama handler
  const handleButtonClick = (e: any, destination: any) => {
    e.stopPropagation();
    router.push(
      destination.isSlideshow
        ? '/book'
        : `/destination/${destination.country.toLowerCase().replace(/\s+/g, '-')}`
    );
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        width: '100%',
        overflow: 'hidden',
        py: 4
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'center' },
          px: { xs: 2, md: 2 }
        }}
      >
        {/* Sol taraf - Başlık */}
        <Box
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            maxWidth: '200px',
            mb: { xs: '1.5rem', md: '2rem' },
            flex: '0 0 15%',
            zIndex: 2,
            mx: { xs: 'auto', md: '2rem' },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
              lineHeight: { xs: 1.4, sm: 1.4 },
              letterSpacing: '1px',
              color: theme.palette.text.primary,
              textTransform: 'none',
              maxWidth: '900px',
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Explore Our Camps
          </Typography>
        </Box>

        {/* Sağ taraf - Slider */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            px: { xs: 0, md: 2 }
          }}
        >
          {/* Navigasyon butonları (sadece desktop) */}
          {!isMobile && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                }}
                aria-label="Previous slide"
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                }}
                aria-label="Next slide"
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}

          {/* Slider */}
          <Box
            component={motion.div}
            animate={{ x: currentPosition }}
            transition={{ 
              type: "tween", 
              ease: "linear", 
              duration: isPaused ? 0.3 : 0 
            }}
            drag={isMobile ? "x" : false}
            dragConstraints={isMobile ? { left: -slidingDistance * 2.5, right: slidingDistance * 0.5 } : false}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            sx={{
              display: 'flex',
              gap: 2,
              cursor: isMobile ? (isDragging ? 'grabbing' : 'grab') : 'default',
              paddingLeft: { xs: 2, md: 0 },
              paddingRight: { xs: 2, md: 0 },
              userSelect: 'none',
            }}
          >
            {infiniteDestinations.map((destination, index) => (
              <motion.div
                key={`${destination.country}-${index}`}
                onMouseEnter={() => handleCardMouseEnter(index)}
                onMouseLeave={handleCardMouseLeave}
                whileHover={!isMobile && !isDragging ? { scale: 1.03 } : {}}
                transition={{ duration: 0.2 }}
              >
                <Box
                  onClick={() => handleCardClick(destination)}
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: '240px', sm: '280px', md: '350px' },
                    height: { xs: '300px', sm: '350px', md: '440px' },
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: isDragging ? 'grabbing' : 'pointer',
                    boxShadow: hoveredCard === index && !isMobile 
                      ? '0px 8px 20px rgba(0,0,0,0.3)' 
                      : '0px 4px 12px rgba(0,0,0,0.2)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${destination.isSlideshow && Array.isArray(destination.image)
                        ? destination.image[slideshowImageIndex]
                        : destination.image
                        })`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Box
                    className="destination-info"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '33.33%',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      p: { xs: 1, md: 1.5 },
                      zIndex: 1,
                      transition: 'height 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden',
                      '&:hover': {
                        height: isDragging ? '33.33%' : '100%',
                      }
                    }}
                  >
                    <Box>
                      <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        fontWeight="bold"
                        sx={{
                          fontSize: { xs: '0.8rem', sm: '0.95rem', md: '1.1rem' },
                          color: theme.palette.primary.contrastText,
                          mb: { xs: 2, sm: 0.5 },
                          mr: { xs: 1},
                        }}
                      >
                        {destination.country}
                      </Typography>
                      <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
                          color: theme.palette.primary.contrastText,
                          mb: { xs: 2, sm: 0.5 },
                          mt: { xs: 0.5, sm: 0 },
                        }}
                      >
                        {destination.nights}
                      </Typography>
                      <Typography
                        variant={isMobile ? 'caption' : 'body2'}
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
                          display: '-webkit-box',
                          color: theme.palette.primary.contrastText,
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          '.destination-info:hover &': {
                            WebkitLineClamp: isDragging ? 3 : 'unset',
                          },
                        }}
                      >
                        {destination.title}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      onClick={(e) => handleButtonClick(e, destination)}
                      sx={{
                        mt: 'auto',
                        mb: { xs: 1, md: 1 },
                        borderRadius: '30px',
                        color: theme.palette.primary.contrastText,
                        backgroundColor: theme.palette.secondary.main,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                        padding: { xs: '4px 8px', md: '6px 12px' },
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '.destination-info:hover &': {
                          opacity: isDragging ? 0 : 1,
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.dark,
                        },
                      }}
                    >
                      {destination.isSlideshow ? 'Start Custom Booking' : `Discover ${destination.country} Trip`}
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DestinationSlider;