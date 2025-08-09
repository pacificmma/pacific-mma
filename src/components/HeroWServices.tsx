import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
const featureImage1 = '/assets/img/home_page/feature_1.jpeg';
const featureImage2 = '/assets/img/home_page/feature_2.jpeg';
const featureImage3 = '/assets/img/home_page/feature_3.jpg';
const photoHero1 = '/assets/img/home_page/photo-1-hero.jpg';
const photoHero2 = '/assets/img/home_page/photo-2-hero.jpg';
const photoHero3 = '/assets/img/home_page/photo-3-hero.jpg';

const features = [
  {
    image: featureImage1,
    title: 'The Ultimate Training Camp, Redefined',
    description: 'Step into a world where ancient warrior traditions meet modern combat excellence. This isn’t just training abroad—it’s a transformative odyssey designed to forge champions. From sunrise beach sessions to sparring alongside UFC legends, every moment is orchestrated for your evolution. We handle the complete journey: exclusive gym access, luxury accommodations, performance nutrition, world-class recovery, and cultural immersion. You bring the warrior spirit. We provide everything else.',
    background: photoHero1,
  },
  {
    image: featureImage2,
    title: 'Train with the Legends',
    description: 'Our exclusive partnerships unlock doors that money alone can’t open. Train where champions are made—from Hawaii’s legendary camps to Vegas’s UFC Performance Institute. This isn’t tourism; it’s initiation into the global fight family. Learn directly from world champions, roll with black belt professors, and gain techniques passed down through generations. Each location offers its own martial arts lineage, creating a diverse mastery that transforms good fighters into complete warriors.',
    background: photoHero2,
  },
  {
    image: featureImage3,
    title: 'Seamless Support, Around the Clock',
    description: "Your dedicated concierge team moves like your corner crew—always there, never in the way. From private jet transfers to securing impossible restaurant reservations, from emergency medical support to capturing your journey on film, we anticipate every need. Our global network of fixers, trainers, and local insiders ensures you experience each destination like a champion, not a tourist. Focus on your transformation. We’ll handle the rest, 24/7.",
    background: photoHero3,
  },
];

const HeroWServices = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll position for mobile indicator
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current && !isLargeScreen) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const slideWidth = scrollWidth / features.length;
        const currentSlide = Math.round(scrollLeft / slideWidth);
        setActiveSlide(Math.max(0, Math.min(features.length - 1, currentSlide)));
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [isLargeScreen]);

  // iPad için siyah alanları eşitle
  useEffect(() => {
    const equalizeTabletBoxes = () => {
      const textBoxes = document.querySelectorAll('.tablet-text-box');
      if (textBoxes.length === 0) return;
      
      let maxHeight = 0;
      
      // Önce doğal yükseklikleri bul
      textBoxes.forEach((box) => {
        const element = box as HTMLElement;
        element.style.height = 'auto';
        element.style.minHeight = 'auto';
        element.style.maxHeight = 'none';
      });
      
      // DOM'un yerleşmesini bekle
      requestAnimationFrame(() => {
        // En yüksek olanı hesapla
        textBoxes.forEach((box) => {
          const rect = box.getBoundingClientRect();
          const height = rect.height;
          if (height > maxHeight) {
            maxHeight = height;
          }
        });
        
        // Hepsine aynı yüksekliği uygula
        if (maxHeight > 0) {
          textBoxes.forEach((box) => {
            const element = box as HTMLElement;
            element.style.height = `${maxHeight}px`;
            element.style.minHeight = `${maxHeight}px`;
            element.style.maxHeight = `${maxHeight}px`;
          });
        }
      });
    };

    // Initial ve resize'da çalıştır
    if (isTablet) {
      setTimeout(equalizeTabletBoxes, 200);
      window.addEventListener('resize', equalizeTabletBoxes);
      return () => window.removeEventListener('resize', equalizeTabletBoxes);
    }
  }, [isTablet]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden', // Changed from 'visible' to prevent overflow issues
        py: { xs: 3, sm: 4, md: 5 },
        background: theme.palette.primary.main,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        borderTop: `6px solid ${theme.palette.secondary.main}`,
      }}
    >
      {/* Başlık Bölümü */}
      <Box
        sx={{
          textAlign: 'center',
          color: theme.palette.primary.contrastText,
          position: 'relative',
          zIndex: 2,
          mb: { xs: 2, sm: 2, md: 3 },
          mt: { xs: 1, sm: 1.5, md: 2 },
          px: { xs: 2, sm: 3, md: 4 }, // Added horizontal padding
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.7rem', sm: '2.4rem', md: '2.8rem' }, // Standardized font size
            lineHeight: { xs: 1.3, sm: 1.3, md: 1.4 },
            letterSpacing: '1px',
            color: theme.palette.primary.contrastText,
            textTransform: 'none',
            maxWidth: '1140px', // Reduced max width
            margin: '0 auto',
            fontFamily: theme.typography.fontFamily,
          }}
        >
          We craft unparalleled{' '}
          <Box
            component="span"
            sx={{
              color: theme.palette.secondary.main,
              fontWeight: 'bold',
            }}
          >
            Mixed Martial Arts (MMA)
          </Box>{' '}
          training and travel experiences for fighters around the globe.
        </Typography>
      </Box>

      {/* Özellik Kartları */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          justifyContent: { xs: 'flex-start', md: 'center' },
          gap: { xs: '15px', sm: '15px', md: '20px' },
          width: { xs: '100%', md: '85%', lg: '80%' },
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          flexDirection: 'row',
          mt: { xs: 1, md: 0 },
          overflowX: { xs: 'auto', md: 'visible' },
          overflowY: 'hidden',
          px: { xs: 2, md: 0 },
          scrollSnapType: { xs: 'x mandatory', md: 'none' },
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          touchAction: { xs: 'manipulation', md: 'auto' },
          scrollBehavior: 'smooth',
        }}
      >
        {features.map((feature, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              width: { xs: '85vw', sm: '95vw', md: '100%' },
              minWidth: { xs: '300px', sm: '600px', md: 'auto' },
              maxWidth: { xs: 'none', sm: '900px', md: '400px', lg: '450px' },
              flex: { xs: '0 0 auto', md: 1 },
              mb: { xs: 0, md: 0 },
              scrollSnapAlign: { xs: 'center', md: 'none' },
            }}
          >
            {/* Görsel */}
            <Box
              sx={{
                width: '100%',
                aspectRatio: { xs: '1/1.8', sm: '1/1.2', md: 'auto' },
                height: { xs: 'auto', sm: 'auto', md: '750px', lg: '800px' },
                minHeight: { xs: '650px', sm: '700px', md: 'auto' },
                borderRadius: { xs: '10px', md: '12px' },
                position: 'relative',
                backgroundImage: `url(${feature.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'hidden',
                cursor: { xs: 'grab', md: 'default' },
                p: { xs: 0, md: 2 },
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                transform: { xs: 'scale(1)', md: 'scale(1)' },
                transition: 'transform 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                '&:active': {
                  cursor: { xs: 'grabbing', md: 'default' },
                  transform: { xs: 'scale(0.98)', md: 'scale(1)' },
                },
              }}
            >
              {/* Yazılar - Mobile ve Desktop için optimize edildi */}
              <Box
                className={isTablet ? "tablet-text-box" : ""}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0, 0, 0, 0.65)',
                  padding: {
                    xs: '16px 12px',
                    sm: '25px 30px',
                    md: '24px 18px'
                  },
                  textAlign: 'center',
                  borderBottomLeftRadius: { xs: '10px', md: '12px' },
                  borderBottomRightRadius: { xs: '10px', md: '12px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: { xs: 1.2, sm: 2.5, md: 2.5 },
                  backdropFilter: 'blur(2px)',
                  height: { xs: 'auto', sm: '500px', md: '380px', lg: '400px' },
                  minHeight: { xs: '280px', sm: '500px', md: '380px', lg: '400px' },
                  maxHeight: { xs: '350px', sm: '500px', md: '380px', lg: '400px' },
                  overflowY: { xs: 'auto', sm: 'hidden', md: 'hidden' },
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: '2px',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    textAlign: 'center',
                    fontFamily: theme.typography.fontFamily,
                    textTransform: 'uppercase',
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                      md: '1.3rem',
                      lg: '1.5rem'
                    },
                    fontWeight: 'bold',
                    lineHeight: { xs: 1.2, sm: 1.25, md: 1.3 },
                    mb: i === 0 ? { xs: 1, sm: 1.2, md: 1.5 } : { xs: 1, sm: 3, md: 3, lg: 3 },
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    textAlign: 'left',
                    fontFamily: theme.typography.fontFamily,
                    fontSize: {
                      xs: '0.8rem',
                      sm: '0.82rem',
                      md: '1rem',
                      lg: '1.1rem'
                    },
                    lineHeight: { xs: 1.3, sm: 1.35, md: 1.4 },
                    textIndent: '1em',
                    hyphens: 'auto',
                    wordBreak: 'break-word',
                    overflow: 'visible',
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Mobile Scroll Indicator */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          gap: 1,
          mt: 2,
        }}
      >
        {features.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: theme.palette.secondary.main,
              opacity: activeSlide === index ? 1 : 0.3,
              transition: 'opacity 0.3s ease',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (scrollContainerRef.current) {
                const slideWidth = scrollContainerRef.current.scrollWidth / features.length;
                scrollContainerRef.current.scrollTo({
                  left: slideWidth * index,
                  behavior: 'smooth'
                });
              }
            }}
          />
        ))}
      </Box>

      {/* Buton Bölümü */}
      <Box
        sx={{
          textAlign: 'center',
          mt: { xs: 2, sm: 3, md: 4, lg: 5 },
          mb: { xs: 3, sm: 4, md: 5 }, // Added bottom margin
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => router.push('/services')}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.contrastText,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            fontWeight: 'bold',
            fontFamily: theme.typography.fontFamily,
            borderRadius: '30px',
            padding: { xs: '6px 20px', sm: '8px 24px', md: '10px 28px' },
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
              color: 'white',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          Services
        </Button>
      </Box>
    </Box>
  );
};

export default HeroWServices;