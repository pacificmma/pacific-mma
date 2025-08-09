import { Box, Typography, IconButton, useTheme, useMediaQuery, Button } from '@mui/material';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { destinations as originalDestinations } from '../utils/destinations';

// Asset paths
const NewYorkPhoto = '/assets/img/home_page/photo-newyork.jpg';
const SanFranciscoPhoto = '/assets/img/home_page/photo-sanfrancisco.jpg';
const NevadaPhoto = '/assets/img/home_page/photo-nevada.jpg';
const LasVegasPhoto = '/assets/img/home_page/photo-lasvegas.jpg';
const JapanPhoto = '/assets/img/home_page/photo-japan.jpg';
const ThailandPhoto = '/assets/img/home_page/photo-thailand.jpg';

interface Destination {
  country: string;
  title: string;
  nights: string;
  image: string | string[];
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

// Sonsuz döngü için kartları 3 kez kopyala
const infiniteCards = [...destinations, ...destinations, ...destinations];

const DestinationSlider = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Mobil için touch/swipe state'leri
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  const animationRef = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));
  const isMD = useMediaQuery(theme.breakpoints.up('md'));
  const isSM = useMediaQuery(theme.breakpoints.up('sm'));
  
  const cardWidth = isXL ? 450 : isLG ? 400 : isMD ? 366 : isSM ? 300 : 256;
  const totalCards = destinations.length;
  const totalWidth = cardWidth * totalCards;
  
  // Custom experience slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % (customExperience.image as string[]).length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Default davranışları engelle
    const touch = e.touches[0] || e.changedTouches[0];
    setTouchStart(touch.clientX);
    setTouchEnd(touch.clientX);
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault(); // Default scroll'u engelle
    const touch = e.touches[0] || e.changedTouches[0];
    const currentTouch = touch.clientX;
    const diff = touchStart - currentTouch;
    
    // Gerçek zamanlı drag feedback
    setDragOffset(-diff * 0.8); // Biraz resistance ekleyelim
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 30; // Daha hassas yapalım
    
    setIsDragging(false);
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      // Swipe yapıldıysa offset'i güncelle
      setOffset(prev => {
        let newOffset = prev - swipeDistance;
        // Sonsuz döngü için sınırları kontrol et
        while (newOffset <= -totalWidth) {
          newOffset += totalWidth;
        }
        while (newOffset >= 0) {
          newOffset -= totalWidth;
        }
        return newOffset;
      });
    }
    
    // Drag offset'i sıfırla
    setDragOffset(0);
    
    // Animasyonu tekrar başlat
    setTimeout(() => {
      setIsPaused(false);
    }, 1500);
  };

  // Sürekli kayma animasyonu
  const animate = useCallback(() => {
    if (!isPaused && !isDragging) {
      setOffset(prev => {
        const speed = isMobile ? 0.8 : 2; // Mobilde biraz daha yavaş
        const newOffset = prev - speed;
        // Bir set tamamlandığında sıfırla
        if (Math.abs(newOffset) >= totalWidth) {
          return 0;
        }
        return newOffset;
      });
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, isDragging, totalWidth, isMobile]);
  
  // Animasyonu başlat/durdur
  useEffect(() => {
    if (!isPaused && !isDragging) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isPaused, isDragging]);

  // Mobil için touch feedback - kartlara dokunduğunda animasyon dursun
  const handleCardTouchStart = (index: number, e: React.TouchEvent) => {
    if (isMobile && !isDragging) {
      // Sadece tap ise (drag değilse) hover efekti ver
      const timeoutId = setTimeout(() => {
        setHoveredIndex(index);
        setIsPaused(true);
        // 3 saniye sonra tekrar başlat
        setTimeout(() => {
          setHoveredIndex(null);
          setIsPaused(false);
        }, 3000);
      }, 100); // Kısa bir gecikme ile drag'den ayır
      
      // Drag başlarsa timeout'u iptal et
      const cleanup = () => {
        clearTimeout(timeoutId);
      };
      
      // Touch move veya end olursa temizle
      const onTouchMove = () => cleanup();
      const onTouchEnd = () => {
        cleanup();
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };
      
      document.addEventListener('touchmove', onTouchMove, { once: true });
      document.addEventListener('touchend', onTouchEnd, { once: true });
    }
  };
  
  // Card click handler
  const handleCardClick = (destination: Destination) => {
    if (destination.isSlideshow) {
      router.push('/book');
    } else {
      router.push(`/destination/${destination.country.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };
  
  // Get image for destination
  const getDestinationImage = (destination: Destination) => {
    if (destination.country === 'Custom Experience') {
      const imageArray = customExperience.image as string[];
      return imageArray[slideshowIndex % imageArray.length];
    }
    
    if (Array.isArray(destination.image)) {
      return destination.image[0];
    }
    
    return destination.image;
  };
  
  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        width: '100%',
        overflow: 'hidden',
        py: { xs: 3, sm: 4, md: 5, lg: 6 }
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
            mb: { 
              xs: '2rem', 
              sm: '2.5rem', 
              md: '3rem', 
              lg: '3.5rem', 
              xl: '4rem' 
            },
            flex: '0 0 15%',
            zIndex: 2,
            mx: { xs: 'auto', md: '4rem' },
            ml: { xs: 'auto', md: '1rem' },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { 
                xs: '1.2rem', 
                sm: '1.8rem', 
                md: '2.2rem', 
                lg: '2.8rem', 
                xl: '3.2rem' 
              },
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

        {/* Sağ taraf - Slider Container */}
        <Box
          ref={sliderRef}
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            px: { xs: 0, md: 2 },
            // Mobil için smooth scrolling
            touchAction: 'pan-x',
            WebkitOverflowScrolling: 'touch',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
          onMouseEnter={() => !isMobile && setIsPaused(true)}
          onMouseLeave={() => !isMobile && setIsPaused(false)}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
          {/* Slider Track */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              transform: `translateX(${offset + dragOffset}px)`,
              willChange: 'transform',
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {infiniteCards.map((destination, index) => (
              <Box
                key={`${destination.country}-${index}`}
                onClick={() => handleCardClick(destination)}
                onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                onTouchStart={(e) => {
                  handleCardTouchStart(index, e);
                }}
                sx={{
                  flex: '0 0 auto',
                  width: { 
                    xs: '260px', 
                    sm: '280px', 
                    md: '320px', 
                    lg: '380px', 
                    xl: '420px' 
                  },
                  height: { 
                    xs: '400px', 
                    sm: '350px', 
                    md: '400px', 
                    lg: '480px', 
                    xl: '540px' 
                  },
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: hoveredIndex === index 
                    ? '0px 8px 24px rgba(0,0,0,0.3)' 
                    : '0px 4px 12px rgba(0,0,0,0.15)',
                  transform: hoveredIndex === index && !isMobile 
                    ? 'scale(1.02) translateY(-4px)' 
                    : 'scale(1)',
                  transition: isDragging ? 'none' : 'all 0.3s ease',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              >
                {/* Card Image */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${getDestinationImage(destination)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                
                {/* Card Content */}
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
                    p: { 
                      xs: 1, 
                      sm: 1.25, 
                      md: 1.5, 
                      lg: 1.75, 
                      xl: 2 
                    },
                    zIndex: 1,
                    transition: 'height 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    '&:hover': {
                      height: hoveredIndex === index && !isMobile ? '100%' : '33.33%',
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
                          WebkitLineClamp: hoveredIndex === index && !isMobile ? 'unset' : 3,
                        },
                      }}
                    >
                      {destination.title}
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(destination);
                    }}
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
                        opacity: hoveredIndex === index && !isMobile ? 1 : 0,
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
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DestinationSlider;