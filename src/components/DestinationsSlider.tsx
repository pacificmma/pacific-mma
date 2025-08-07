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
  
  const animationRef = useRef<number | null>(null);
  
  const cardWidth = isMobile ? 256 : 366; // 240+16 veya 350+16 (gap dahil)
  const totalCards = destinations.length;
  const totalWidth = cardWidth * totalCards;
  
  // Custom experience slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % (customExperience.image as string[]).length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Sürekli kayma animasyonu
  const animate = useCallback(() => {
    if (!isPaused) {
      setOffset(prev => {
        const newOffset = prev - 2; // Piksel hızı
        // Bir set tamamlandığında sıfırla
        if (Math.abs(newOffset) >= totalWidth) {
          return 0;
        }
        return newOffset;
      });
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, totalWidth]);
  
  // Animasyonu başlat/durdur
  useEffect(() => {
    if (!isPaused) {
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
  }, [animate, isPaused]);
  
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

        {/* Sağ taraf - Slider Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            px: { xs: 0, md: 2 }
          }}
          onMouseEnter={() => !isMobile && setIsPaused(true)}
          onMouseLeave={() => !isMobile && setIsPaused(false)}
          onTouchStart={() => isMobile && setIsPaused(true)}
          onTouchEnd={() => isMobile && setTimeout(() => setIsPaused(false), 1000)}
        >
          {/* Slider Track */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              transform: `translateX(${offset}px)`,
              willChange: 'transform',
            }}
          >
            {infiniteCards.map((destination, index) => (
              <Box
                key={`${destination.country}-${index}`}
                onClick={() => handleCardClick(destination)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  flex: '0 0 auto',
                  width: { xs: '240px', md: '350px' },
                  height: { xs: '300px', md: '440px' },
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
                  transition: 'all 0.3s ease',
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
                    p: { xs: 1, md: 1.5 },
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