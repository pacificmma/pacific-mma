import { useState } from 'react';
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
    title: 'Customized Trips',
    description: 'We offer exceptional tours that combine top-notch martial arts training with unforgettable travel experiences. Our expertise in destinations, athletic training, and nutrition allows us to curate the best routes, training sessions, meals, and fun activities. We handle everything, allowing you to enjoy your adventures and focus on your training.',
    background: photoHero1,
  },
  {
    image: featureImage2,
    title: 'Best MMA Network',
    description: 'Our global trainer network includes top dojos, mixed martial arts studios, schools, and gyms, all recognized for their excellence in their respective disciplines and services. We offer MMA fighters access to a diverse and exclusive network of academies specializing in MMA, striking, and grappling.',
    background: photoHero2,
  },
  {
    image: featureImage3,
    title: '24/7 Travel Assistance',
    description: "Wherever you go, our team or our partners will be available to assist you throughout the day as needed. Please let us know what you require, and we will address it promptly. Whether it's an emergency, an issue with your accommodation or car rental, or a request for a restaurant or club reservation, we are here to help.",
    background: photoHero3,
  },
];

const HeroWServices = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden', // Changed from 'visible' to prevent overflow issues
        pt: { xs: '0.8rem', sm: '1rem', md: '1.2rem' },
        background: theme.palette.primary.main,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        borderTop: `5px solid ${theme.palette.secondary.main}`,
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
            fontSize: { xs: '1.4rem', sm: '2rem', md: '2.5rem' }, // Reduced font size slightly
            lineHeight: { xs: 1.3, sm: 1.3, md: 1.4 },
            letterSpacing: '1px',
            color: theme.palette.primary.contrastText,
            textTransform: 'none',
            maxWidth: '800px', // Reduced max width
            margin: '0 auto',
            fontFamily: theme.typography.fontFamily,
          }}
        >
          Travel The World & Train Martial Arts
        </Typography>
      </Box>

      {/* Özellik Kartları */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: '15px', sm: '15px', md: '20px' },
          width: { xs: '92%', sm: '90%', md: '85%', lg: '80%' },
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          flexDirection: { xs: 'column', md: 'row' },
          mt: { xs: 1, md: 0 },
        }}
      >
        {features.map((feature, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              flex: { xs: 'none', md: 1 },
              mb: { xs: 2, sm: 2, md: 0 }, // Added bottom margin for mobile spacing
            }}
          >
            {/* Görsel */}
            <Box
              component={!isLargeScreen ? 'div' : motion.div}
              onMouseEnter={!isLargeScreen ? undefined : () => setHoveredIndex(i)}
              onMouseLeave={!isLargeScreen ? undefined : () => setHoveredIndex(null)}
              animate={!isLargeScreen ? {} : { scale: hoveredIndex === i ? 1.05 : 1 }}
              transition={!isLargeScreen ? {} : { duration: 0.3, ease: 'easeInOut' }}
              sx={{
                width: '100%',
                height: { xs: 'auto', sm: 'auto', md: '400px', lg: '450px' },
                aspectRatio: { xs: '1 / 1', md: '3 / 4' },
                borderRadius: { xs: '10px', md: '12px' },
                position: 'relative',
                backgroundImage: !isLargeScreen
                  ? `url(${feature.image})`
                  : hoveredIndex !== null
                    ? `url(${features[hoveredIndex].background})`
                    : `url(${feature.image})`,
                backgroundSize: !isLargeScreen ? 'cover' : hoveredIndex !== null ? '300% 100%' : 'cover',
                backgroundPosition: !isLargeScreen ? 'center' : hoveredIndex !== null ? `${i * 50}% center` : 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'hidden',
                cursor: !isLargeScreen ? 'default' : 'pointer',
                transition: !isLargeScreen
                  ? 'none'
                  : 'background-image 0.5s ease-in-out, background-position 0.5s ease-in-out',
                p: { xs: 0, md: 2 },
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              }}
            >
              {/* Yazılar - Mobile ve Desktop için optimize edildi */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: {
                    xs: '10px',
                    sm: '12px',
                    md: '16px'
                  },
                  textAlign: 'center',
                  borderBottomLeftRadius: { xs: '10px', md: '12px' },
                  borderBottomRightRadius: { xs: '10px', md: '12px' },
                  height: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' }, // Height for desktop version
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
                      sm: '1.1rem',
                      md: '1.1rem',
                      lg: '1.2rem'
                    },
                    fontWeight: 'bold',
                    mb: { xs: 0.5, sm: 0.7, md: 1 }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    textAlign: 'center',
                    fontFamily: theme.typography.fontFamily,
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.8rem',
                      md: '0.85rem',
                      lg: '0.9rem'
                    },
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    px: { xs: 1, sm: 1.5, md: 2 },
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          </Box>
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