import React from 'react';
import { Box, Typography, Button, useTheme, Container } from '@mui/material';

// ✅ Next.js compatible asset import - use public folder path
const CampHeroPhoto = '/assets/img/camp_page/youthCampHero.jpg';

const YouthCamp = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '60vh',
        backgroundImage: `url(${CampHeroPhoto})`, // ✅ Direct string usage
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        color: '#fff',
        pt: { xs: 6, md: 8 },
        pb: { xs: 6, md: 10 },
        borderTop: `5px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      />

      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '800px',
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.4rem', sm: '2rem', md: '2.6rem' },
            lineHeight: { xs: 1.4, sm: 1.4 },
            letterSpacing: '1px',
            color: theme.palette.primary.contrastText,
            textTransform: 'none',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: theme.typography.fontFamily,
          }}
        >
          Where Young Warriors Discover the World
        </Typography>

        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3, color: theme.palette.text.secondary, fontFamily: theme.typography.fontFamily }}>
          Give your child more than martial arts—give them a passport to adventure. Our Youth MMA Camps blend world-class training with unforgettable journeys, creating confident warriors who explore fearlessly. Under expert supervision, kids master Brazilian Jiu-Jitsu, Kickboxing, and self-defense while discovering new places, cultures, and friendships that last a lifetime.
        </Typography>

        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3, color: theme.palette.text.secondary, fontFamily: theme.typography.fontFamily }}>
          From local adventure days to exclusive youth retreats, we transform curious kids into capable young warriors. They’ll train where champions train, explore like adventurers, and return home with skills, stories, and unshakeable confidence.
        </Typography>

        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4, color: theme.palette.text.secondary, fontFamily: theme.typography.fontFamily }}>
          Where discipline meets discovery. Where young warriors rise
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.contrastText,
            padding: '12px 30px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            fontFamily: theme.typography.fontFamily,
            borderRadius: '30px',
            '&:hover': { backgroundColor: theme.palette.secondary.dark, color: 'white' },
          }}
        >
          Explore Youth Camps
        </Button>
      </Container>
    </Box>
  );
};

export default YouthCamp;