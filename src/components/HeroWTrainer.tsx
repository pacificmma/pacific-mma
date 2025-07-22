// src/components/HeroWTrainer.tsx
import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import BrendaWBrothers from '../assets/img/home_page/brenda_brothers.jpeg';
import { useRouter } from 'next/router';
import { StaticImageData } from 'next/image';

// ✅ CHANGE: Video now references public folder
const backgroundVideo = '/assets/videos/trainingWhero.mp4';

const HeroWTrainer = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '75vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: { xs: 2, md: 6 },
      }}
    >
      {/* Background video */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </Box>

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          zIndex: 2,
          maxWidth: '1600px',
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'space-between',
          gap: { xs: '2rem', md: '3rem' },
          padding: { xs: '2rem', md: '4rem' },
          borderRadius: '25px',
          opacity: '0.9',
          backgroundColor: theme.palette.primary.main,
        }}
      >
        {/* Text Content */}
        <Box 
          sx={{ 
            flex: { xs: '1', md: '1.2' }, 
            textAlign: { xs: 'center', md: 'left' },
            paddingRight: { md: '1rem' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.4rem', sm: '2.5rem', md: '3rem' },
              lineHeight: { xs: 1.4, sm: 1.4 },
              letterSpacing: '1px',
              color: theme.palette.primary.contrastText,
              textTransform: 'none',
              fontFamily: theme.typography.fontFamily,
              marginTop: 0,
              paddingTop: 0,
            }}
          >
            Pacific MMA Academy
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 2,
              mb: 3,
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Come, discover the deep waters of mixed martial arts at the Pacific Mixed Martial
            Arts Academy. Under the expert guidance of our Chief Instructor, Brenda King, we offer
            a rigorous and comprehensive curriculum designed to cultivate well-rounded fighters.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Our academy provides classes, coaching, and private training in{' '}
            <span style={{ fontWeight: 'bold', color: theme.palette.text.secondary, fontSize: '1rem', fontFamily: theme.typography.fontFamily }}>
              Brazilian Jiu-Jitsu, Muay Thai, Kickboxing, Boxing, and Combat Wrestling.
            </span>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 600,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Affiliated with Eric Paulson&apos;s CSW Academy and frequently visited by top-tier mixed
            martial artists, our academy fosters a friendly culture and nurturing environment for
            both adults and children. Visit our state-of-the-art facility in the Bay Area, California,
            to learn more about our classes, workshops, and schedule.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'center', md: 'flex-start' },
            width: '100%'
          }}>
            <Button
              variant="contained"
              onClick={() => router.push('/academy')}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
                padding: '10px 24px',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                fontFamily: theme.typography.fontFamily,
                borderRadius: '30px',
                maxWidth: '180px',
                '&:hover': { backgroundColor: theme.palette.secondary.dark, color: 'white' },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        {/* Image */}
        <Box
          sx={{
            flex: { xs: '1', md: '0.8' },
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
            alignItems: 'flex-start',
            height: '100%',
            mt: 0,
            pt: 0,
          }}
        >
          <Box
            component="img"
            src={(BrendaWBrothers as StaticImageData).src}
            alt="Brenda King with Fighters"
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: '500px', md: '500px' },
              borderRadius: '16px',
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.4)',
              marginTop: 0,
              paddingTop: 0,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HeroWTrainer;