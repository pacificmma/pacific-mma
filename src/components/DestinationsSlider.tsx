import { Box, Typography, IconButton, useTheme, useMediaQuery, Button } from '@mui/material';
import { motion, PanInfo } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { destinations as originalDestinations } from '../utils/destinations';

// ✅ FIXED: Use string paths for Next.js public assets
const NewYorkPhoto = '/assets/img/home_page/photo-newyork.jpg';
const SanFranciscoPhoto = '/assets/img/home_page/photo-sanfrancisco.jpg';
const NevadaPhoto = '/assets/img/home_page/photo-nevada.jpg';
const LasVegasPhoto = '/assets/img/home_page/photo-lasvegas.jpg';
const JapanPhoto = '/assets/img/home_page/photo-japan.jpg';
const ThailandPhoto = '/assets/img/home_page/photo-thailand.jpg';

// ✅ FIXED: Updated interface to use only string paths
interface Destination {
  country: string;
  title: string;
  nights: string;
  image: string | string[]; // ✅ Only string paths now
  isSlideshow?: boolean;
  description?: string;
  price?: number;
  date?: string;
  videoUrl?: string;
  whatYouWillEnjoy?: string[];
  generalInfo?: string[];
  descriptionPage?: string;
  gyms?: string[];
  disciplines?: string[];
}

const customExperience: Destination = {
  country: 'Custom Experience',
  title: 'Design Your Custom Trip',
  nights: 'Flexible',
  image: [NewYorkPhoto, SanFranciscoPhoto, NevadaPhoto, LasVegasPhoto, JapanPhoto, ThailandPhoto],
  isSlideshow: true,
};

const destinations = [customExperience, ...originalDestinations] as Destination[];

// Sonsuz döngü için kartları çoğaltıyoruz
const infiniteDestinations: Destination[] = [...destinations, ...destinations, ...destinations];

const DestinationSlider = () => {  
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [pausedPosition, setPausedPosition] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);

  const cardWidth = isMobile ? 240 + 16 : 350 + 16;
  const totalOriginalItems = destinations.length;
  const slidingDistance = cardWidth * totalOriginalItems;

  // Başlangıç pozisyonu - ortadaki set
  const initialPosition = -slidingDistance;
  // Otomatik slide fonksiyonu - her platform için
  const startAutoSlide = useCallback(() => {
    if (!isPaused && isMountedRef.current && isAutoSliding) {
      const animate = () => {
        if (isPaused || !isMountedRef.current || !isAutoSliding) return;
        
        setCurrentPosition(prev => {
          const newPosition = prev - (isMobile ? 1 : 2); // Mobilde daha yavaş
          
          // Sonsuz döngü için sınır kontrolu
          if (newPosition <= -slidingDistance * 2) {
            return -slidingDistance;
          }
          
          return newPosition;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isPaused, isMobile, slidingDistance, isAutoSliding]);

  // Auto slide'i durdur
  const stopAutoSlide = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Component mount edildiğinde auto slide'i başlat
  useEffect(() => {
    isMountedRef.current = true;
    setCurrentPosition(initialPosition);
    
    // Tüm platformlar için auto slide başlat
    timeoutRef.current = setTimeout(() => {
      startAutoSlide();
    }, 100);

    return () => {
      isMountedRef.current = false;
      stopAutoSlide();
    };
  }, [initialPosition, startAutoSlide]);

  // Pause ve auto slide durumunu kontrol et
  useEffect(() => {
    if (isMountedRef.current) {
      if (isPaused || !isAutoSliding) {
        stopAutoSlide();
      } else {
        // Kaldığı pozisyondan devam et
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          startAutoSlide();
        }, 100);
      }
    }
  }, [isPaused, isAutoSliding, startAutoSlide]);

  // Mouse/Touch event handlers - hem desktop hem mobil
  const handleCardMouseEnter = (index: number) => {
    if (!isDragging) {
      setHoveredCard(index);
      setPausedPosition(currentPosition); // Mevcut pozisyonu kaydet
      setIsPaused(true);
      setIsAutoSliding(false);
    }
  };

  const handleCardMouseLeave = () => {
    if (!isDragging) {
      setHoveredCard(null);
      // Kaldığı yerden devam et
      setCurrentPosition(pausedPosition);
      setTimeout(() => {
        setIsPaused(false);
        setIsAutoSliding(true);
      }, 150);
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

  // Touch/Drag handlers - tüm platformlar
  const handleDragStart = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(true);
    setDragStartX(info.point.x);
    setDragOffset(0);
    setPausedPosition(currentPosition);
    setIsPaused(true);
    setIsAutoSliding(false);
  };

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isDragging) {
      setDragOffset(info.offset.x);
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 80;
    const velocityThreshold = 300;

    // Velocity tabanlı veya mesafe tabanlı karar verme
    const shouldSlide = Math.abs(dragDistance) > threshold || Math.abs(velocity) > velocityThreshold;

    if (shouldSlide) {
      const direction = dragDistance > 0 || velocity > 0 ? 1 : -1;
      const cardOffset = Math.round(Math.abs(dragDistance) / cardWidth) + 1;
      const slideDistance = cardWidth * Math.min(cardOffset, 2); // Max 2 kart kaydırma
      
      const newPosition = pausedPosition + (direction * slideDistance);
      setCurrentPosition(newPosition);

      // Sınır kontrolü ve sonsuz döngü
      if (newPosition >= 0) {
        setTimeout(() => {
          const adjustedPosition = -slidingDistance + (newPosition % cardWidth);
          setCurrentPosition(adjustedPosition);
          setPausedPosition(adjustedPosition);
        }, 300);
      } else if (newPosition <= -slidingDistance * 2) {
        setTimeout(() => {
          const adjustedPosition = -slidingDistance + (Math.abs(newPosition) % cardWidth);
          setCurrentPosition(adjustedPosition);
          setPausedPosition(adjustedPosition);
        }, 300);
      } else {
        setPausedPosition(newPosition);
      }
    } else {
      // Snap back to paused position
      setCurrentPosition(pausedPosition);
    }

    // Reset drag state ve auto slide'i yeniden başlat
    setDragOffset(0);
    setTimeout(() => {
      setIsDragging(false);
      setIsPaused(false);
      setIsAutoSliding(true);
    }, 200);
  };

  // ✅ FIXED: Book sayfasındaki exact code
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % (customExperience.image as string[]).length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // 🔧 FIX: Kart tıklama handler - proper typing (239:41)
  const handleCardClick = (destination: Destination) => {
    if (!isDragging) {
      router.push(
        destination.isSlideshow
          ? '/book'
          : `/destination/${destination.country.toLowerCase().replace(/\s+/g, '-')}`
      );
    }
  };

  // 🔧 FIX: Buton tıklama handler - proper typing (250:33, 250:51)
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, destination: Destination) => {
    e.stopPropagation();
    router.push(
      destination.isSlideshow
        ? '/book'
        : `/destination/${destination.country.toLowerCase().replace(/\s+/g, '-')}`
    );
  };

  // ✅ FIXED: Custom experience için doğru image handling - book sayfasındaki gibi
  const getDestinationImage = (destination: Destination) => {
    // Diğer destinasyonlar için (Custom Experience değilse)
    if (Array.isArray(destination.image)) {
      return destination.image[0];
    }
    
    return destination.image;
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
            mb: { xs: '3rem', md: '4rem' },
            flex: '0 0 15%',
            zIndex: 2,
            mx: { xs: 'auto', md: '4rem' },
            ml: { xs: 'auto', md: '1rem' },
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
            BESPOKE FIGHT CAMPS
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
            animate={{ 
              x: isMobile && isDragging ? currentPosition + dragOffset : currentPosition 
            }}
            transition={{ 
              type: isPaused || (isMobile && isDragging) ? "spring" : "linear",
              damping: isPaused || (isMobile && isDragging) ? 25 : 0,
              stiffness: isPaused || (isMobile && isDragging) ? 300 : 0,
              duration: isPaused ? 0.4 : (isMobile && !isDragging ? 0.6 : 0)
            }}
            drag="x"
            dragConstraints={false}
            dragElastic={0.05}
            dragMomentum={true}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            sx={{
              display: 'flex',
              gap: 2,
              cursor: isDragging ? 'grabbing' : 'grab',
              paddingLeft: { xs: 2, md: 0 },
              paddingRight: { xs: 2, md: 0 },
              userSelect: 'none',
            }}
          >
            {infiniteDestinations.map((destination, index) => {
              
              return (
              <motion.div
                key={`${destination.country}-${index}`}
                onMouseEnter={() => handleCardMouseEnter(index)}
                onMouseLeave={handleCardMouseLeave}
                whileHover={!isMobile && !isDragging && hoveredCard === index ? { 
                  scale: 1.03,
                  y: -5 
                } : {}}
                transition={{ 
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  duration: 0.3 
                }}
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
                      ? '0px 12px 30px rgba(0,0,0,0.4)' 
                      : '0px 4px 12px rgba(0,0,0,0.2)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    transform: hoveredCard === index && !isMobile ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: (() => {
                        // ✅ FIXED: Custom Experience için hardcode debug
                        if (destination.country === 'Custom Experience') {
                          const imageArray = [NewYorkPhoto, SanFranciscoPhoto, NevadaPhoto, LasVegasPhoto, JapanPhoto, ThailandPhoto];
                          const currentImg = imageArray[slideshowIndex % imageArray.length];
                          return `url(${currentImg})`;
                        }
                        
                        // Diğer destinasyonlar için
                        const img = Array.isArray(destination.image) ? destination.image[0] : destination.image;
                        return `url(${img})`;
                      })(),
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
            )})}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DestinationSlider;